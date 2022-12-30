const fs = require('fs');
const studentsService = require('../../service/studentService');
const qs = require('qs');
const {raw} = require("mysql");

class HomeHandleRouter {
    static getHomeHtml(homeHtml, students) {
        let tbody = '';
        students.map((student, index) => {
            tbody += `
                    <tr>
                    <td>${index + 1}</td>
                    <td>${student.name}</td>
                    <td>${student.address}</td>
                    <td>${student.scores}</td>
                    <td>${student.Class}</td>
                    <td>${student.sex}</td>
                    <td><a href="/edit/${student.id}"><button style="background-color: green; color: white">Sua</button></a>
                    <a href="/delete/${student.id}"><button style="background-color: red; color: white">Xoa</button></a></td>
                </tr>
                    `
        })
        homeHtml = homeHtml.replace('{students}', tbody);
        return homeHtml;
    }

    showHome(req, res) {
        fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
            if (err) {
                console.log(err.message)
            } else {
                let student = await studentsService.findAll()
                homeHtml = HomeHandleRouter.getHomeHtml(homeHtml, student);
                res.writeHead(200, 'text/html');
                res.write(homeHtml);
                res.end();
            }
        })
    }

    createStudent(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(createHtml);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const student = qs.parse(data);
                    const mess = await studentsService.addStudent(student);
                    console.log(mess)
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    async deleteStudent(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/delete.html', 'utf-8', (err, deleteHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    res.writeHead(200, 'text/html');
                    deleteHtml = deleteHtml.replace('{id}', id);
                    res.write(deleteHtml);
                    res.end();
                }
            })
        } else {
            await studentsService.deleteStudent(id)
            res.writeHead(301, {'location': '/home'});
            res.end();
        }
    }

    async editStudent(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    let student = await studentsService.finById(id)

                    editHtml = editHtml.replace('{name}', student[0].name);
                    editHtml = editHtml.replace('{address}', student[0].address);
                    editHtml = editHtml.replace('{scores}', student[0].scores);
                    editHtml = editHtml.replace('{Class}', student[0].Class);
                    editHtml = editHtml.replace('{sex}', student[0].sex);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let editData = ''
            req.on('data', chunk => {
                editData += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const student = qs.parse(editData);
                    // console.log(student)
                    const mess = await studentsService.editStudent(student, id);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }
}

module.exports = new HomeHandleRouter();