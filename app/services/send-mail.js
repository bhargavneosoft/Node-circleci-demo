import model from '../server/schema';
import sgMail from '@sendgrid/mail';
import changeCase from 'change-case';
import apiHandler from './api-handler';

sgMail.setApiKey(process.env.SENDGRID_KEY);

module.exports = {
	sendMails: (user, email, res, req) => {
		let verifyCode;
		model.codeVerification.getCodeDetailsByUserId(user._id, (err, codeData) => {
			if (err) {
				apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
			} else if (!codeData || codeData == null) {
				var newCode = new model.codeVerification({
					user_id: user._id,
					verificationCode: changeCase.lowerCase(randomstring.generate(6)),
					email: email
				});
				model.codeVerification.createCode(newCode);
				verifyCode = newCode.verificationCode;
			} else if (codeData && (codeData.verificationCode == null || codeData.verificationCode.length == 0)) {
				verifyCode = codeData.verificationCode = changeCase.lowerCase(randomstring.generate(6));
				codeData.save();
			} else {
				verifyCode = codeData.verificationCode;
				codeData.save();
			}
			console.log('Verification code to be sent in the mail body ->', verifyCode);
			/**
       * Send  verification code on user email.
      */
			const msg = {
				to: email,
				from: 'pushkar.abhishek@neosofttech.com',
				subject: 'Reset password',
				html: `<div style="background-color:forestgreen;border: 0 solid #fff;padding:3em;"><div>
        <h1 style="font-family:Helvetica,Arial,sans-serif;margin:0;line-height:70px;color:#fff;padding-left: 20px;"><center>Inventory Management System</center></h1></div>
        <br><br>Hi ${changeCase.upperCaseFirst(
			user.firstName
		)},<br><br><span>You recently requested to reset your password for your IMS account.
        <br> Your password  Confirmation Code is  <b>${verifyCode}</b>.<br>`
			};
			sgMail
				.send(msg)
				.then(() => {
					apiHandler.setSuccessResponse(
						{ message: `Code has been sent to ${changeCase.upperCaseFirst(user.firstName)}` },
						res,
						req
					);
				})
				.catch((err) => {
					console.log('err in sending mail------', err);
					apiHandler.setErrorResponse('ERROR_WHILE_MAIL_SENDING', res, req);
				});
		});
	}
};
