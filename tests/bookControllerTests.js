// require('should');
const testsLogic = require('./bookControllerTestsLogic');

describe('Book Controller Tests:', () => {
  describe('Post', () => {
    it('should not allow an empty title on post', testsLogic.postWithEmptyTitle);
  });
  describe('Put', () => {
    it('should not allow an empty title on put', testsLogic.putWithEmptyTitle);
  });
  describe('Patch', () => {
    it('should return the same object with only change in \'author\' field', testsLogic.patchOnlyAuthor);
  });
  describe('Middleware - Check if ID exists', () => {
    it('should throw a 404 error if ID doesn\'t exist ', testsLogic.nonExistentID);
  });
});
