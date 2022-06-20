const medical_controller = require('./controller/medical_controller.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

module.exports = function (app) {
  function authenToken(res, req, next) {
    const AuthorizationHeader = res.headers.authorization;

    if (AuthorizationHeader) {
      const token = AuthorizationHeader.split(' ')[1];

      console.log('Authorization');
      try {
        jwt.verify(token, "8'!$-!.M$jx>c?se", (err, data) => {
          if (err) {
            req.locals.message = 'error';
            console.log(err);
          } else {
            req.locals.message = 'Successfull';
          }
        });
      } catch (err) {
        console.log('Something wrong: ', err);
      }
    } else {
      req.locals.message = 'error';
    }

    next();
  }

  //signin
  app.route('/signin').post(medical_controller.signin);

  //Patient
  app
    .route('/Appointment/:Patient_ID')
    .get(authenToken, medical_controller.getAppointmentPatientID);

  app
    .route('/Patient/:username')
    .get(authenToken, medical_controller.getUserInfor);

  app
    .route('/deleteAppointment/:Appointment_ID/')
    .get(authenToken, medical_controller.deleteAppointment);
  app
    .route('/AvailableDoctor')
    .post(authenToken, medical_controller.getAvailableDoctor);

  app
    .route('/createAppointment')
    .post(authenToken, medical_controller.createAppointment);

  app
    .route('/prescription')
    .post(authenToken, medical_controller.getPrescription);

  app
    .route('/ChangeInfor/:User_ID')
    .post(authenToken, medical_controller.getChangeInfor);

  //Hospital
  app.route('/Faculty').get(authenToken, medical_controller.getFaculty);
};
