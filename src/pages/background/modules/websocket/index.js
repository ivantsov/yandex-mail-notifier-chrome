import debounce from 'lodash.debounce';
import {subscribe} from 'redux-subscriber';
import store from '../../redux/store';
import {login, logout} from '../../redux/actions/user';
import {loadMessagesCount} from '../../redux/actions/messages';
import {showNewNotification} from '../../redux/actions/notification';
import {
  ERROR,
  MESSAGE,
} from './constants';
import initWSClient from './client';

const {alarms} = chrome;

const config = {
  connect: {
    name: 'connect',
    time: 1, // try to connect if failed before
  },
  reconnect: {
    name: 'reconnect',
    time: 1.9, // reconnect to websocket; we use double value to prevent receiving the 3rd ping before reconnect
  },
};

// not gonna workout because:
// 1) if user isn't authorized, we dispatch login, subscriber calls "reconnect"
// 2) anyway wsClient will be called without uid, it'll trigger an error and call everything once again
// I need a way how to handle the following cases:
// a) can't connect to the socket for auth reason
// b) socket was closed with some error

let wsClient;

async function connect() {
  const {dispatch, getState} = store;
  const {
    authorized,
    token,
    uid,
  } = getState().user;

  alarms.clear(config.reconnect.name);

  try {
    alarms.create(config.reconnect.name, {delayInMinutes: config.reconnect.time});

    wsClient.connect({
      uid,
      token,
    });

    // throw new Error('test');
    // authorize user if he hadn't been before
    // needed in case when e.g. there was an error, we caught it, logged out user and now trying to reconnect
    if (!authorized) {
      dispatch(login());
    }
  } catch (err) {
    // once we dispatched "logout", the subscriber below will call "disconnect" and it'll clear the reconnect alarm
    dispatch(logout());

    alarms.create(config.connect.name, {delayInMinutes: config.connect.time});

    // throw unhandled exception for raven
    throw err;
  }
}

const reconnect = debounce(() => {
  wsClient.disconnect();
  connect();
}, 500);

function disconnect() {
  alarms.clear(config.reconnect.name);
  wsClient.disconnect();
}

function onMessage(data) {
  const {dispatch} = store;
  const {
    operation,
    message,
  } = data;

  if (operation !== 'insert' || message.hdr_status !== 'New') {
    dispatch(loadMessagesCount());
    return;
  }

  const {
    new_messages: unreadCount,
    mid: id,
    hdr_from: from,
    hdr_subject: subject,
    firstline,
  } = message;

  const nameMatch = from.match(/^"(.+)"/);
  const emailMatch = from.match(/<(.+)>$/);

  dispatch(loadMessagesCount(parseInt(unreadCount, 10)));
  dispatch(showNewNotification({
    id,
    from: nameMatch[1] || emailMatch[1],
    subject: subject !== 'No subject' ? subject : '',
    message: firstline,
  }));
}

// const IGNORED_ERRORS = [
//   1006, // abnormal closure
//   4400, // missing uid
// ];
function onError(err) {
  store.dispatch(logout());
  // if (err && !IGNORED_ERRORS.includes(err.code)) {
  //   window.Raven.captureException(err, {
  //     extra: err,
  //   });
  //
  //   store.dispatch(logout());
  //   store.dispatch(login());
  //   // TODO: if the error wouldn't disappear enable reloading
  //   // reloadApp();
  //
  //   return;
  // }
  //
  // reconnect();
}

function emitEvent(eventType, data) {
  if (eventType === ERROR) {
    onError(data);
  }
  if (eventType === MESSAGE) {
    onMessage(data);
  }
}

function handleAlarm({name}) {
  if (name === config.connect.name) {
    connect();
  } else if (name === config.reconnect.name) {
    reconnect();
  }
}

export default function () {
  wsClient = initWSClient(emitEvent);

  alarms.onAlarm.addListener(handleAlarm);

  subscribe('user.authorized', ({user: {authorized}}) => {
    if (authorized) {
      reconnect();
    } else {
      disconnect();
    }
  });
}
