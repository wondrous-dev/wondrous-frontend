const THOUSAND = 1000
const MILLION = THOUSAND ** 2
const BILLION = THOUSAND ** 3

export const shrinkNumber = (number = 0) => {
	const shrinkThousands = ({
		divider = THOUSAND,
		fractionDigits = 1,
		letter = 'k',
	} = {}) => {
		return `${(number / divider).toFixed(fractionDigits)}${letter}`
	}

	if (number < THOUSAND) {
		return number
	}
	if (number < THOUSAND * 10) {
		return shrinkThousands() // 1234 => 1.2k
	}
	if (number < MILLION) {
		return shrinkThousands({ fractionDigits: 0 }) // 12345 => 12k, 123456 => 123k
	}
	if (number < BILLION) {
		return shrinkThousands({ divider: MILLION, letter: 'M' }) // 1234567 => 1.2M
	}
}

export const toggleHtmlOverflow = () => {
	const htmlTagElements = document.getElementsByTagName('html')
	const { style } = htmlTagElements.item(0)

	style.overflow = style.overflow ? '' : 'hidden'
}
