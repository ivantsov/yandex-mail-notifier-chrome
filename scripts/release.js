const {execSync} = require('child_process');
const fs = require('fs-extra');

const paths = [
    './package.json',
    './src/manifest.json'
];

function validate(newVersion) {
    const semverRegex = /^\d+\.\d+\.\d+$/;

    if (!newVersion || !semverRegex.test(newVersion)) {
        throw new Error('The release version is not provided or is incorrect');
    }
}

function updateVersion(newVersion) {
    paths.forEach(path => {
        const config = fs.readJsonSync(path);
        config.version = newVersion;
        fs.writeJsonSync(path, config);
    });
}

function makeCommit(newVersion) {
    paths.forEach(path => execSync(`git add ${path}`));
    execSync(`git commit -m "bump v${newVersion}"`);
    execSync(`git tag v${newVersion}`);
}

const newVersion = process.argv[2];

validate(newVersion);

updateVersion(newVersion);
console.log(`Package version has been updated to ${newVersion}`);

makeCommit(newVersion);
console.log(`Tag has been set to v${newVersion}`);
