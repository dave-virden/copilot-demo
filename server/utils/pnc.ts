import { pncFormatValidator } from './pncValidator'

const SERIAL_NUM_LENGTH = 7
const VALID_LETTERS = 'ZABCDEFGHJKLMNPQRTUVWXY'

const padSerialNumber = (serialNumber: string): string => serialNumber.padStart(SERIAL_NUM_LENGTH, '0')

export function computePncCheckChar(shortYear: string, serialNum: string): string {
  const indexStr = `${shortYear}${padSerialNumber(serialNum)}`
  const checkIndex = parseInt(indexStr, 10) % VALID_LETTERS.length
  return VALID_LETTERS[checkIndex]
}

export function generatePncShort(): string {
  const now = new Date()
  const shortYear = String(now.getFullYear() % 100).padStart(2, '0')
  let serialNum: string
  let pnc: string
  for (let attempts = 0; attempts < 5; attempts += 1) {
    // Generate a 1–6 digit serial (avoid zero)
    serialNum = String(Math.floor(Math.random() * 999999) + 1)
    const checkChar = computePncCheckChar(shortYear, serialNum)
    pnc = `${shortYear}/${serialNum}${checkChar}`
    if (pncFormatValidator(pnc)) return pnc
  }
  // Fallback to padded serial if retries fail
  serialNum = String(Math.floor(Math.random() * 10_000_000))
  const checkChar = computePncCheckChar(shortYear, serialNum)
  return `${shortYear}/${padSerialNumber(serialNum)}${checkChar}`
}

export function generatePncLong(): string {
  const now = new Date()
  const fullYear = String(now.getFullYear())
  const shortYear = fullYear.slice(2)
  let serialNum: string
  let pnc: string
  for (let attempts = 0; attempts < 5; attempts += 1) {
    serialNum = Math.floor(Math.random() * 10_000_000).toString()
    const checkChar = computePncCheckChar(shortYear, serialNum)
    pnc = `${fullYear}/${padSerialNumber(serialNum)}${checkChar}`
    if (pncFormatValidator(pnc)) return pnc
  }
  // Fallback single attempt
  const checkChar = computePncCheckChar(shortYear, serialNum!)
  return `${fullYear}/${padSerialNumber(serialNum!)}${checkChar}`
}
