/* @flow */
import chai from "chai";
import { ASTTypes } from "constants/ApplicationConstants";
import createImport from "util/createImport";

import type {
  Project,
  StateProperties,
  ImportDeclaration,
  ASTItem,
  Program,
  RequiredImport
} from "types";

const expect = chai.expect;

describe("createImport", () => {
  it("should create an import with one named import correctly", () => {
    expect(createImport("redux", ["createStore"])).to.deep.equal({
      type: ASTTypes.ImportDeclaration,
      start: 0,
      end: 22,
      specifiers: [
        {
          type: ASTTypes.ImportSpecifier,
          start: 0,
          end: 13,
          imported: {
            type: ASTTypes.Identifier,
            start: 0,
            end: 13,
            name: "createStore"
          },
          local: {
            type: ASTTypes.Identifier,
            start: 0,
            end: 13,
            name: "createStore"
          }
        }
      ],
      source: {
        type: ASTTypes.Literal,
        start: 15,
        end: 22,
        value: "redux",
        raw: "'redux'"
      }
    });
  });
  it("should create an import with multiple named imports correctly", () => {
    expect(
      createImport("redux", ["createStore", "combineReducers", "foo"])
    ).to.deep.equal({
      type: "ImportDeclaration",
      start: 0,
      end: 76,
      specifiers: [
        {
          type: "ImportSpecifier",
          start: 0,
          end: 13,
          imported: {
            type: "Identifier",
            start: 0,
            end: 13,
            name: "createStore"
          },
          local: { type: "Identifier", start: 0, end: 13, name: "createStore" }
        },
        {
          type: "ImportSpecifier",
          start: 27,
          end: 44,
          imported: {
            type: "Identifier",
            start: 27,
            end: 44,
            name: "combineReducers"
          },
          local: {
            type: "Identifier",
            start: 27,
            end: 44,
            name: "combineReducers"
          }
        },
        {
          type: "ImportSpecifier",
          start: 62,
          end: 67,
          imported: { type: "Identifier", start: 62, end: 67, name: "foo" },
          local: { type: "Identifier", start: 62, end: 67, name: "foo" }
        }
      ],
      source: {
        type: "Literal",
        start: 69,
        end: 76,
        value: "redux",
        raw: "'redux'"
      }
    });
  });
});
