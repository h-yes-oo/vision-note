import { decodeUnicode } from 'functions';

test('correctly decode unicode', () => {
  expect(decodeUnicode(`%uCF54%uCF54`)).toMatchInlineSnapshot(`"코코"`);
});
