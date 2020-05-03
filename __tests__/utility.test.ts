import * as utility from '../src/utility'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

test('matches open checklists', async () =>  {
  const body = `
  Curabitur blandit tempus porttitor.
  - [ ] Item  one
  - [ ] Item two
  Sed posuere consectetur est at lobortis.
  - [ ] Item three
  `
  const result = utility.findChecklists(body)
  expect(result.open).toEqual(3)
  expect(result.closed).toEqual(0)
})

test('matches closed checklists', async () =>  {
  const body = `
  Curabitur blandit tempus porttitor.
  - [x] Item  one
  - [x] Item two
  Sed posuere consectetur est at lobortis.
  - [x] Item three
  `
  const result = utility.findChecklists(body)
  expect(result.open).toEqual(0)
  expect(result.closed).toEqual(3)
})

test('matches mixed open closed', async () =>  {
  const body = `
  Curabitur blandit tempus porttitor.
  - [x] Item  one
  - [ ] Item two
  Sed posuere consectetur est at lobortis.
  - [x] Item three
  `
  const result = utility.findChecklists(body)
  expect(result.open).toEqual(1)
  expect(result.closed).toEqual(2)
})

test('matches nested checklists', async () =>  {
  const body = `
  Curabitur blandit tempus porttitor.
  - [x] Item  one
    - [ ] Nested item two
  Sed posuere consectetur est at lobortis.
  - [x] Item three
    - [ ] Nested item four
      - [x] Nested item five
  `
  const result = utility.findChecklists(body)
  expect(result.open).toEqual(2)
  expect(result.closed).toEqual(3)
})
