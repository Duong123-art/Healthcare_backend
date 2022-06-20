const mysql = require('mysql');
const { response } = require('../../server.js');

const database = require('../connectdatabase.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const e = require('express');

module.exports = {
  //Login-Signin

  signin: function (req, res) {
    if (typeof req.body !== undefined) {
      const userAccount = req.body;

      console.log(userAccount);

      var sql = `SELECT * FROM biqtzwqiihjmw2npadtd.Role INNER JOIN biqtzwqiihjmw2npadtd.Account On biqtzwqiihjmw2npadtd.Role.Role_ID = biqtzwqiihjmw2npadtd.Account.Role_ID Where UserName=\"${userAccount.username}\"`;
      database.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        }

        if (
          typeof result !== 'undefined' &&
          typeof userAccount.password !== 'undefined' &&
          userAccount.password === result[0].Password
        ) {
          const accessToken = jwt.sign(
            { ...userAccount, Role: result[0].Role },
            process.env.PRIVATE_TOKEN_KEY,
            {
              expiresIn: '7d',
            }
          );
          res.json({ accessToken: accessToken });
        } else {
          res.json({ message: 'Login fail' });
        }
      });
    }
  },

  //Patient
  getAppointmentPatientID: function (req, res) {
    const userID = req.params.Patient_ID;

    if (res.locals.message === 'Successfull') {
      var sql = `select biqtzwqiihjmw2npadtd.Appointment.PatientNote, biqtzwqiihjmw2npadtd.Appointment.Appointment_ID, biqtzwqiihjmw2npadtd.Appointment.AppointmentName, 
      biqtzwqiihjmw2npadtd.Appointment.DateTime, biqtzwqiihjmw2npadtd.Doctor.DName, biqtzwqiihjmw2npadtd.Doctor.Image , biqtzwqiihjmw2npadtd.Faculty.Faculty 
      from biqtzwqiihjmw2npadtd.Appointment left join biqtzwqiihjmw2npadtd.Doctor 
      on biqtzwqiihjmw2npadtd.Doctor.User_ID = biqtzwqiihjmw2npadtd.Appointment.Doctor_ID left join biqtzwqiihjmw2npadtd.Faculty on biqtzwqiihjmw2npadtd.Faculty.Faculty_ID = biqtzwqiihjmw2npadtd.Doctor.Faculty_ID where biqtzwqiihjmw2npadtd.Appointment.Patient_ID =${userID}
      order by biqtzwqiihjmw2npadtd.Appointment.DateTime `;
      database.query(sql, (err, response) => {
        if (err) {
          res.json({ message: "Get user's appoinment failed" });
        } else {
          res.json({
            message: 'Get users appointment succesfull',
            data: response,
          });
        }
      });
    } else {
      res.json({ message: 'Authorization fail' });
    }
  },

  deleteAppointment: (req, res) => {
    const Appointment_ID = req.params.Appointment_ID;

    if (res.locals.message === 'Successfull') {
      const sql = `Delete from biqtzwqiihjmw2npadtd.Appointment where biqtzwqiihjmw2npadtd.Appointment.Appointment_ID =${Appointment_ID}`;
      database.query(sql, (err, result) => {
        if (err) {
          res.json({ message: 'Delete fail' });
          console.log(err);
          console.log('Delete Fail');
        } else {
          res.json({ message: 'Delete successful' });
          console.log('Delete Successful');
        }
      });
    } else {
      res.json({ message: 'Authorization fail' });
      console.log('Delete Authorization err');
    }
  },

  getAvailableDoctor: (req, res) => {
    const availableDoctor = req.body;
    console.log(availableDoctor);
    if (res.locals.message === 'Successfull') {
      let sql = `SELECT biqtzwqiihjmw2npadtd.Appointment.Doctor_ID
      FROM biqtzwqiihjmw2npadtd.Appointment join biqtzwqiihjmw2npadtd.Doctor
      on biqtzwqiihjmw2npadtd.Doctor.User_ID = biqtzwqiihjmw2npadtd.Appointment.Doctor_ID
      where biqtzwqiihjmw2npadtd.Doctor.Faculty_ID = ${
        availableDoctor.Faculty_ID
      }
      and  biqtzwqiihjmw2npadtd.Appointment.DateTime= \"${
        availableDoctor.date + ' ' + availableDoctor.time
      }\"`;

      database.query(sql, (err, result) => {
        if (err) {
          res.json({ message: 'Get available doctor fail' });
        } else {
          if (result) {
            let handleResult = '';

            result.forEach((item, index) => {
              handleResult = handleResult.concat(
                index === 0 ? `${item.Doctor_ID}` : `,${item.Doctor_ID}`
              );
            });

            console.log('handle', handleResult);

            sql = `SELECT biqtzwqiihjmw2npadtd.Doctor.User_ID, biqtzwqiihjmw2npadtd.Doctor.DName,
          biqtzwqiihjmw2npadtd.Doctor.Image
          FROM biqtzwqiihjmw2npadtd.Doctor
          where biqtzwqiihjmw2npadtd.Doctor.Faculty_ID = ${
            availableDoctor.Faculty_ID
          } 
          ${
            handleResult
              ? `and not biqtzwqiihjmw2npadtd.Doctor.User_ID ${
                  handleResult.length > 1
                    ? `in\(${handleResult}\)`
                    : `=${handleResult}`
                }`
              : ``
          }`;

            database.query(sql, (err, finalResult) => {
              if (err) {
                res.json({ message: 'query fail' });
              } else {
                res.json({
                  message: 'Get available successful',
                  data: finalResult,
                });
              }
            });
          }
        }
      });
    } else {
      res.json({ message: 'Authorization fail' });
    }
  },

  createAppointment: (req, res) => {
    const appointmentInfo = req.body;
    if (res.locals.message === 'Successfull') {
      const sql = `INSERT INTO biqtzwqiihjmw2npadtd.Appointment(Patient_ID, Doctor_ID, AppointmentName, DateTime, Diagnostic, PatientNote) 
    VALUES(${appointmentInfo.Patient_ID}, ${appointmentInfo.Doctor_ID}, \"${appointmentInfo.AppointmentName}\", 
      \"${appointmentInfo.DateTime}\", \"${appointmentInfo.Diagnostic}\", \"${appointmentInfo.PatientNote}\")`;

      database.query(sql, (err, result) => {
        if (err) {
          res.json({ message: 'Create Appointment fail' });
        } else {
          res.json({ message: 'Create Appointment successful' });
        }
      });
    } else {
      res.json({ message: 'Authorization fail' });
    }
  },

  getPrescription: (req, res) => {
    const User_ID = req.body.User_ID;
    if (res.locals.message === 'Successfull') {
      let sql = `SELECT biqtzwqiihjmw2npadtd.Prescription.Prescription_ID, biqtzwqiihjmw2npadtd.Prescription.Expiration, biqtzwqiihjmw2npadtd.Prescription.CreateAt FROM biqtzwqiihjmw2npadtd.Prescription join biqtzwqiihjmw2npadtd.Appointment on biqtzwqiihjmw2npadtd.Appointment.Prescription_ID = biqtzwqiihjmw2npadtd.Prescription.Prescription_ID where biqtzwqiihjmw2npadtd.Appointment.Patient_ID =${User_ID} order by biqtzwqiihjmw2npadtd.Prescription.Expiration`;

      database.query(sql, (err, result) => {
        if (err) {
          res.json({ message: 'Get prescription fail' });
        } else {
          if (result) {
            sql = `SELECT biqtzwqiihjmw2npadtd.PrescriptionDetail.PrescriptionDetail_ID,
            biqtzwqiihjmw2npadtd.Medicine.Name, biqtzwqiihjmw2npadtd.PrescriptionDetail.Usage, biqtzwqiihjmw2npadtd.PrescriptionDetail.Session,
            biqtzwqiihjmw2npadtd.PrescriptionDetail.Amount
            FROM biqtzwqiihjmw2npadtd.Prescription join biqtzwqiihjmw2npadtd.PrescriptionDetail on biqtzwqiihjmw2npadtd.PrescriptionDetail.Prescription_ID = biqtzwqiihjmw2npadtd.Prescription.Prescription_ID join biqtzwqiihjmw2npadtd.Medicine on biqtzwqiihjmw2npadtd.Medicine.Medicine_ID = biqtzwqiihjmw2npadtd.PrescriptionDetail.Medicine_ID join biqtzwqiihjmw2npadtd.Appointment
            on biqtzwqiihjmw2npadtd.Appointment.Prescription_ID = biqtzwqiihjmw2npadtd.Prescription.Prescription_ID where biqtzwqiihjmw2npadtd.Appointment.Patient_ID = ${User_ID} and biqtzwqiihjmw2npadtd.Prescription.Prescription_ID = ${
              result[result.length - 1].Prescription_ID
            } `;
            database.query(sql, (err, innerResult) => {
              if (err) {
                res.json({ message: `Get prescription fail: ${err}` });
              } else {
                console.log(result.CreateAt);
                finalResult = {
                  CreateAt: result[result.length - 1].CreateAt,
                  Expiration: result[result.length - 1].Expiration,
                  ListMedicine: [
                    {
                      id: 1,
                      title: 'Buổi sáng',
                      data: innerResult.filter(
                        (item) => item.Session === 'Buổi sáng'
                      ),
                    },
                    {
                      id: 2,
                      title: 'Buổi chiều',
                      data: innerResult.filter(
                        (item) => item.Session === 'Buổi chiều'
                      ),
                    },
                    {
                      id: 3,
                      title: 'Buổi tối',
                      data: innerResult.filter(
                        (item) => item.Session === 'Buổi tối'
                      ),
                    },
                  ],
                };
                res.json({
                  message: 'Get prescription succesful',
                  data: finalResult,
                });
              }
            });
          }
        }
      });
    } else {
      res.json({ message: 'Authorization fail' });
    }
  },

  getUserInfor: (req, res) => {
    const username = req.params.username;

    if (res.locals.message === 'Successfull') {
      let sql = `Select biqtzwqiihjmw2npadtd.Account.User_ID  FROM biqtzwqiihjmw2npadtd.Account  where biqtzwqiihjmw2npadtd.Account.username =\"${username}\"`;
      database.query(sql, (err, response) => {
        if (err) res.json({ message: `Get user information error: ${err}` });
        else {
          if (response) {
            sql = `Select * from biqtzwqiihjmw2npadtd.Patient where biqtzwqiihjmw2npadtd.Patient.User_ID = ${response[0].User_ID}`;
            database.query(sql, (err, result) => {
              if (err) {
                res.json({ message: 'Get user information fail' });
              } else {
                res.json({
                  message: 'Get user information successful',
                  data: result[0],
                });
              }
            });
          }
        }
      });
    } else {
      res.json({ message: 'Authorization fail' });
    }
  },

  getChangeInfor: (req, res) => {
    const newInfo = req.body;
    const User_ID = req.params.User_ID;
    if (res.locals.message === 'Successfull') {
      console.log(User_ID);
      let columnTable = '';
      Object.keys(newInfo).forEach((item, index) => {
        if (item === 'Phone') {
          if (index === Object.keys(newInfo).length - 1) {
            columnTable += `biqtzwqiihjmw2npadtd.Patient.${item}=${newInfo[item]}`;
          } else {
            columnTable += `biqtzwqiihjmw2npadtd.Patient.${item}=${newInfo[item]},`;
          }
        } else if (index === Object.keys(newInfo).length - 1) {
          columnTable += `biqtzwqiihjmw2npadtd.Patient.${item}=\"${newInfo[item]}\"`;
        } else {
          columnTable += `biqtzwqiihjmw2npadtd.Patient.${item}=\"${newInfo[item]}\",`;
        }
      });

      const sql = `Update biqtzwqiihjmw2npadtd.Patient set ${columnTable} where biqtzwqiihjmw2npadtd.Patient.User_ID = ${User_ID}`;
      database.query(sql, (err, result) => {
        if (err) {
          res.json({ message: `Message change information fail: ${err}` });
        } else {
          res.json({ message: 'Message change information successful' });
        }
      });
    }
  },

  //Hospital
  getFaculty: (req, res) => {
    if (res.locals.message === 'Successfull') {
      const sql =
        'SELECT biqtzwqiihjmw2npadtd.Faculty.Faculty FROM biqtzwqiihjmw2npadtd.Faculty';
      database.query(sql, (err, response) => {
        if (err) {
          res.json({ message: 'Get faculty fail' });
        } else {
          res.json({ message: 'Get Faculty successful', data: response });
        }
      });
    } else {
      res.json({ message: 'Authorization fail' });
    }
  },
};
