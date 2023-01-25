import { URL, InvalidUrlError } from './url.vo';

describe('URL VO', () => {
  describe('when given valid url', () => {
    it('should return valid URLVo', () => {
      const inp = 'http://www.google.com';
      const u = URL.create(inp);

      expect(u.isOk());

      const url = u.unwrap();
      expect(url.url).toBe(inp);
    });
  });

  describe('when given invalid url', () => {
    it('should return Err with InvalidUrlError', () => {
      const inp = 'hwwwwgoogle.com';
      const u = URL.create(inp);

      expect(u.isErr());

      const err = u.unwrapErr();
      expect(err).toBeInstanceOf(InvalidUrlError);
    });
  });
});
