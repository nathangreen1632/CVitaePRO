import { formatWorkDates } from './formatWorkDates'

describe('formatWorkDates', () => {
  it('returns "start to end" when both are valid', () => {
    expect(formatWorkDates('2020', '2023')).toBe('2020 to 2023')
  })

  it('returns just start when end is empty', () => {
    expect(formatWorkDates('2020', '')).toBe('2020')
  })

  it('returns just start when end is "undefined"', () => {
    expect(formatWorkDates('2020', 'undefined')).toBe('2020')
  })

  it('returns "N/A" if start is null/undefined/empty', () => {
    expect(formatWorkDates('', '2023')).toBe('N/A')
    expect(formatWorkDates('null', '2023')).toBe('N/A')
    expect(formatWorkDates('undefined', '2023')).toBe('N/A')
  })
})
