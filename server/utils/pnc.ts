const SERIAL_NUM_LENGTH = 7
const VALID_LETTERS = 'ZABCDEFGHJKLMNPQRTUVWXY'

const padSerialNumber = (serialNumber: string): string => serialNumber.padStart(SERIAL_NUM_LENGTH, '0')

export function computePncCheckChar(shortYear: string, serialNum: string): string {
  const indexStr = `${shortYear}${padSerialNumber(serialNum)}`
  const checkIndex = parseInt(indexStr, 10) % VALID_LETTERS.length
  return VALID_LETTERS[checkIndex]
}

export function generatePnc(): string {
  // Long-form PNC: YYYY/NNNNNNN[L]
  const now = new Date()
  const fullYear = String(now.getFullYear()) // 4-digit year
  const shortYear = fullYear.slice(2) // last two digits for checksum
  const serialNum = Math.floor(Math.random() * 10_000_000).toString() // up to 7 digits
  const checkChar = computePncCheckChar(shortYear, serialNum)
  return `${fullYear}/${padSerialNumber(serialNum)}${checkChar}`
}
