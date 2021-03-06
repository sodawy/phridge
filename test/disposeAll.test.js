"use strict";

var chai = require("chai");
var when = require("when");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var phridge = require("../lib/main.js");
var Phantom = require("../lib/Phantom.js");
var slow = require("./helpers/slow.js");

chai.config.includeStack = true;
chai.use(chaiAsPromised);

describe("disposeAll()", function () {

    it("should exit cleanly all running phantomjs instances", slow(function () {
        var exited = [];

        return when.all([
                phridge.spawn(),
                phridge.spawn(),
                phridge.spawn()
            ])
            .then(function (p) {
                p[0].childProcess.on("exit", function () { exited.push(0); });
                p[1].childProcess.on("exit", function () { exited.push(1); });
                p[2].childProcess.on("exit", function () { exited.push(2); });

                return phridge.disposeAll();
            })
            .then(function () {
                exited.sort();
                expect(exited).to.eql([0, 1, 2]);
            });
    }));

});