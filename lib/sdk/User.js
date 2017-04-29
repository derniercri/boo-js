"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseUsers = parseUsers;
exports.parseUser = parseUser;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = exports.User = function User(name, password) {
  _classCallCheck(this, User);

  this.name = name;
  this.password = password;
};

function parseUsers(data) {
  return data.map(function (item) {
    return parseUser(item);
  });
}

function parseUser(data) {
  return new User(data.name, data.password);
}