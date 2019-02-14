/**
 * @fileoverview Tests for JSLint XML reporter.
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert,
    formatter = require("../../../lib/formatters/jslint-xml"),
    CLIEngine = require("../../../lib/cli-engine");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("formatter:jslint-xml", () => {
    describe("when passed a single message", () => {

        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", () => {
            const result = formatter(code);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /></file></jslint>");
        });
    });

    describe("when passed a fatal error message", () => {

        const code = [{
            filePath: "foo.js",
            messages: [{
                fatal: true,
                message: "Unexpected foo.",
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", () => {
            const result = formatter(code);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /></file></jslint>");
        });
    });

    describe("when passed multiple messages", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }, {
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }];

        it("should return a string in JSLint XML format with 2 issues in 1 file", () => {
            const result = formatter(code);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /><issue line=\"6\" char=\"11\" evidence=\"bar\" reason=\"Unexpected bar. (bar)\" /></file></jslint>");
        });
    });

    describe("when passed multiple files with 1 message each", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }, {
            filePath: "bar.js",
            messages: [{
                message: "Unexpected bar.",
                severity: 1,
                line: 6,
                column: 11,
                ruleId: "bar",
                source: "bar"
            }]
        }];

        it("should return a string in JSLint XML format with 2 issues in 2 files", () => {
            const result = formatter(code);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /></file><file name=\"bar.js\"><issue line=\"6\" char=\"11\" evidence=\"bar\" reason=\"Unexpected bar. (bar)\" /></file></jslint>");
        });
    });

    describe("when passing a single message with illegal characters", () => {

        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected <&\"'>\b\t\n\f\r牛逼 foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo",
                source: "foo"
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", () => {
            const result = formatter(code);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected &lt;&amp;&quot;&apos;&gt;&#8;&#9;&#10;&#12;&#13;&#29275;&#36924; foo. (foo)\" /></file></jslint>");
        });
    });

    describe("when passing a single message with no source", () => {

        const code = [{
            filePath: "foo.js",
            messages: [{
                message: "Unexpected foo.",
                severity: 2,
                line: 5,
                column: 10,
                ruleId: "foo"
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", () => {
            const result = formatter(code);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"\" reason=\"Unexpected foo. (foo)\" /></file></jslint>");
        });
    });

    describe("when passing a single message without rule id", () => {
        const code = [{
            filePath: "foo.js",
            messages: [{
                severity: 2,
                line: 5,
                column: 10
            }]
        }];

        it("should return a string in JSLint XML format with 1 issue in 1 file", () => {
            const result = formatter(code);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"\" reason=\"\" /></file></jslint>");
        });
    });
    describe("when passed no results", () => {

        it("should return a string in JSLint XML format with no files", () => {
            const result = formatter([]);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint></jslint>");
        });
    });

    describe("when retrieved through CLIEngine.getFormatter", () => {

        it("should return a function that formats results as JSLint XML", () => {
            const publicFormatter = CLIEngine.getFormatter("jslint-xml");

            assert.isFunction(publicFormatter);

            const result = publicFormatter([{
                filePath: "foo.js",
                messages: [{
                    message: "Unexpected foo.",
                    severity: 2,
                    line: 5,
                    column: 10,
                    ruleId: "foo",
                    source: "foo"
                }]
            }]);

            assert.strictEqual(result, "<?xml version=\"1.0\" encoding=\"utf-8\"?><jslint><file name=\"foo.js\"><issue line=\"5\" char=\"10\" evidence=\"foo\" reason=\"Unexpected foo. (foo)\" /></file></jslint>");
        });
    });
});
