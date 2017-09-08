/* @flow */
import chai from "chai";
import { ASTTypes } from "constants/ApplicationConstants";
import addRequiredImports from "util/addRequiredImports";

import type {
  Project,
  StateProperties,
  ImportDeclaration,
  ASTItem,
  Program,
  RequiredImport
} from "types";

const expect = chai.expect;

let defaultMockProgram: Program = {
  type: ASTTypes.Program,
  body: [],
  start: 0,
  end: 0,
  sourceType: "module"
};

let mockProgram: Program;

describe("addRequiredImports", () => {
  beforeEach(() => {
    mockProgram = { ...defaultMockProgram };
  });
  it("should do nothing if there are no required imports", () => {
    expect(addRequiredImports([], mockProgram)).to.deep.equal(mockProgram);
  });
  it("should do nothing if there are all required imports already have at least one import from the same module", () => {
    mockProgram = {
      ...defaultMockProgram,
      body: [
        {
          type: "ImportDeclaration",
          start: 0,
          end: 26,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 0,
              end: 15,
              imported: {
                type: "Identifier",
                start: 0,
                end: 15,
                name: "Record"
              },
              local: {
                type: "Identifier",
                start: 0,
                end: 15,
                name: "Record"
              }
            },
            {
              type: "ImportSpecifier",
              start: 16,
              end: 25,
              imported: {
                type: "Identifier",
                start: 16,
                end: 26,
                name: "List"
              },
              local: {
                type: "Identifier",
                start: 16,
                end: 26,
                name: "List"
              }
            }
          ],
          source: {
            type: "Literal",
            start: 16,
            end: 26,
            value: "immutable",
            raw: "'immutable'"
          }
        },
        {
          type: "ImportDeclaration",
          start: 0,
          end: 35,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 9,
              end: 15,
              imported: {
                type: "Identifier",
                start: 9,
                end: 15,
                name: "combineReducers"
              },
              local: {
                type: "Identifier",
                start: 9,
                end: 15,
                name: "combineReducers"
              }
            }
          ],
          source: {
            type: "Literal",
            start: 23,
            end: 34,
            value: "redux",
            raw: "'redux'"
          }
        }
      ]
    };
    addRequiredImports(
      [
        {
          module: "redux",
          imports: ["combineReducers"]
        },
        {
          module: "immutable",
          imports: ["List", "Record"]
        }
      ],
      mockProgram
    );
    expect(
      addRequiredImports(
        [
          {
            module: "redux",
            imports: ["combineReducers"]
          },
          {
            module: "immutable",
            imports: ["List", "Record"]
          }
        ],
        mockProgram
      )
    ).to.deep.equal(mockProgram);
  });
  it("should add imports to an empty file", () => {
    const program: Program = addRequiredImports(
      [
        {
          module: "redux",
          imports: ["combineReducers"]
        },
        {
          module: "immutable",
          imports: ["List", "Record"]
        }
      ],
      mockProgram
    );
    expect(program).to.deep.equal({
      type: "Program",
      start: 0,
      end: 60,
      body: [
        {
          type: "ImportDeclaration",
          start: 0,
          end: 26,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 0,
              end: 17,
              imported: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              },
              local: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              }
            }
          ],
          source: {
            type: "Literal",
            start: 19,
            end: 26,
            value: "redux",
            raw: "'redux'"
          }
        },
        {
          type: "ImportDeclaration",
          start: 0,
          end: 34,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 0,
              end: 6,
              imported: {
                type: "Identifier",
                start: 0,
                end: 6,
                name: "List"
              },
              local: { type: "Identifier", start: 0, end: 6, name: "List" }
            },
            {
              type: "ImportSpecifier",
              start: 13,
              end: 21,
              imported: {
                type: "Identifier",
                start: 13,
                end: 21,
                name: "Record"
              },
              local: { type: "Identifier", start: 13, end: 21, name: "Record" }
            }
          ],
          source: {
            type: "Literal",
            start: 23,
            end: 34,
            value: "immutable",
            raw: "'immutable'"
          }
        }
      ],
      sourceType: "module"
    });
  });
  it("should add imports to a non-empty file", () => {
    mockProgram = {
      ...defaultMockProgram,
      body: [
        {
          type: "ImportDeclaration",
          start: 0,
          end: 26,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 0,
              end: 17,
              imported: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              },
              local: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              }
            }
          ],
          source: {
            type: "Literal",
            start: 19,
            end: 26,
            value: "reflux",
            raw: "'reflux'"
          }
        },
        {
          type: "VariableDeclaration",
          start: 77,
          end: 100,
          declarations: [
            {
              type: "VariableDeclarator",
              start: 83,
              end: 99,
              id: {
                type: "Identifier",
                start: 83,
                end: 90,
                name: "chicken"
              },
              init: {
                type: "Literal",
                start: 93,
                end: 99,
                value: "test",
                raw: '"test"'
              }
            }
          ],
          kind: "const"
        }
      ]
    };
    const program: Program = addRequiredImports(
      [
        {
          module: "redux",
          imports: ["combineReducers"]
        },
        {
          module: "immutable",
          imports: ["List", "Record"]
        }
      ],
      mockProgram
    );
    expect(program).to.deep.equal({
      type: "Program",
      start: 0,
      end: 60,
      body: [
        {
          type: "ImportDeclaration",
          start: 0,
          end: 26,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 0,
              end: 17,
              imported: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              },
              local: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              }
            }
          ],
          source: {
            type: "Literal",
            start: 19,
            end: 26,
            value: "redux",
            raw: "'redux'"
          }
        },
        {
          type: "ImportDeclaration",
          start: 0,
          end: 34,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 0,
              end: 6,
              imported: {
                type: "Identifier",
                start: 0,
                end: 6,
                name: "List"
              },
              local: { type: "Identifier", start: 0, end: 6, name: "List" }
            },
            {
              type: "ImportSpecifier",
              start: 13,
              end: 21,
              imported: {
                type: "Identifier",
                start: 13,
                end: 21,
                name: "Record"
              },
              local: { type: "Identifier", start: 13, end: 21, name: "Record" }
            }
          ],
          source: {
            type: "Literal",
            start: 23,
            end: 34,
            value: "immutable",
            raw: "'immutable'"
          }
        },
        {
          type: "ImportDeclaration",
          start: 0,
          end: 26,
          specifiers: [
            {
              type: "ImportSpecifier",
              start: 0,
              end: 17,
              imported: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              },
              local: {
                type: "Identifier",
                start: 0,
                end: 17,
                name: "combineReducers"
              }
            }
          ],
          source: {
            type: "Literal",
            start: 19,
            end: 26,
            value: "reflux",
            raw: "'reflux'"
          }
        },
        {
          type: "VariableDeclaration",
          start: 77,
          end: 100,
          declarations: [
            {
              type: "VariableDeclarator",
              start: 83,
              end: 99,
              id: {
                type: "Identifier",
                start: 83,
                end: 90,
                name: "chicken"
              },
              init: {
                type: "Literal",
                start: 93,
                end: 99,
                value: "test",
                raw: '"test"'
              }
            }
          ],
          kind: "const"
        }
      ],
      sourceType: "module"
    });
  });
});
