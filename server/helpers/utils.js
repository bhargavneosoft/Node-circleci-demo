import model from '../schema';
import { sep } from 'path';
/**
 * padDigits prepends the digits{*} before the number{*}
 * @param {digits}  // total digits you want
 */
export const padDigits = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				count.event_log++;
				count.save();
				let number = count.event_log;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const padClientRefDigits = (number, digits) => {
	return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
};

export const padDigitsForEvent = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				let number = count.event_log;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const padDigitsForOperator = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				count.operator_qa_reference++;
				count.save();
				let number = count.operator_qa_reference;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const padDigitsForCTOS = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				count.ctos_number++;
				count.save();
				let number = count.ctos_number;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const padDigitsForIR = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				count.IR_number++;
				count.save();
				let number = count.IR_number;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const padDigitsForBoxNumber = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				count.outerbox_reference++;
				count.save();
				let number = count.outerbox_reference;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const latestBoxNumber = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				let number = count.outerbox_reference;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const padDigitsForASN = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				count.ASN_number++;
				count.save();
				let number = count.ASN_number;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const padDigitsForNCL = (digits) => {
	return new Promise((resolve, reject) => {
		model.counter.getCount((err, count) => {
			if (!err) {
				count.NCL_number++;
				count.save();
				let number = count.NCL_number;
				let final = Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
				resolve(final);
			}
		});
	});
};

export const splitData = (seprator, string) => {
	return string.split(seprator);
};
