const connection = require("../model/connetion")
connection.connected();

class StudentService {
    findAll() {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from students', (err,student) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(student)
                }
            })
        })
    }

    addStudent(student) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`insert into management.students(name, address, scores, Class, sex)
                           values ('${student.name}', '${student.address}', ${student.scores}, ${student.Class}, "${student.sex}"
                                   )`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('đã có thêm 1 thằng học lại')
                }
            })
        })
    }

    deleteStudent(id) {
        let connect = connection.getConnection();
        let sql = `delete
                   from students
                   where id = ${id}`;
        return new Promise((resolve, reject) => {
            connect.query(sql, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('không học được thì lướt')
                }
            })
        })
    }

    finById(id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`SELECT * FROM management.students WHERE id = ${id}`,(err, student) => {
                if (err) {
                    reject(err)
                } else {

                    resolve(student)
                }
            })
        })
    }

    editStudent(student, id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update students set name = '${student.name}', address = '${student.address}',scores = ${student.scores}, Class = ${student.Class}, sex = '${student.sex}'
                where id = ${id}`, (err, student) => {
                if (err) {
                    reject(err);
                } else {
                    console.log("thi lại à mà phải sửa" )
                    resolve(student);
                }
            })
        })
    }
}

const studentsService = new StudentService();
module.exports = studentsService;