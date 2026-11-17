const http = require("http");
const fs = require("fs");
const path = require("path");


const PORT = 3000;
const DATA_FILE = path.join(__dirname,"registration.json");

function readStudents(){
        const data = fs.readFileSync(DATA_FILE,"utf8");
        return JSON.parse(data);   
}

function saveStudents(students){
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(students, null, 4)
    );
}

// Generate  Student ID
function generateStudentId(students) {
    let studentId;

    do {
        studentId = "IITV-" + Math.floor(Math.random() * 1000000);
    } while (students.some(student => student.studentId === studentId));

    return studentId;
}

// Send JSON response
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}


const server = http.createServer((req,res)=>{

    
if (req.method === "POST" && req.url === "/api/register") {

    let body = "";

    req.on("data", chunk => {
        body += chunk;
    });

    req.on("end", () => {

        if (body.length > 10000) {
            return sendJSON(res, 413, {
                message: "Request is too large",
    });
}
    
            try {

                
                const student = JSON.parse(body);

                const name = String(student.name || "").trim();
                const email = String(student.email || "").trim();
                const event = String(student.event || "").trim();
                const message = String(student.message || "").trim();

                // Check required fields
                if (!name || !email || !event) {
                    return sendJSON(res, 400, {
                        message: "Please fill all required fields"
                    });
                }

                // Read database
                const students = readStudents();

                // Generate Student ID
                const studentId = generateStudentId(students);

                // Create new student record
                const newStudent = {
                    studentId: studentId,
                    name: name,
                    email: email,
                    event: event,
                    message: message
                };

                
                students.push(newStudent);

                
                saveStudents(students);

                
                return sendJSON(res, 201, {
                    message: "Registration successful",
                    student: newStudent
                });

            } catch (error) {

                return sendJSON(res, 400, {
                    message: "Invalid data or database error"
                });

            }
        });

    return;
}
    
if (req.method === "GET" && req.url.startsWith("/api/student")) {
    const requestedURL = new URL(
        req.url,
        `http://localhost:${PORT}`
    );

    const studentId = requestedURL.searchParams.get("id");

    if (!studentId) {
        return sendJSON(res, 400, {
            message: "Please enter a Student ID"
        });
    }

    try {
        const students = readStudents();

        const student = students.find(
            s => s.studentId.toLowerCase() === studentId.trim().toLowerCase()
        );

        if (!student) {
            return sendJSON(res, 404, {
                message: "No registration found for this Student ID."
            });
        }

        return sendJSON(res, 200, {
            message: "Student found",
            student: student
        });

    } catch (error) {
        return sendJSON(res, 500, {
            message: "Unable to read student records"
        });
    }
}
    if (req.method === "GET") {

        const requestedURL = new URL(
            req.url,
            `http://localhost:${PORT}`
        );

        let requestedPath = decodeURIComponent(
            requestedURL.pathname
        );

        if (requestedPath === "/") {
            requestedPath = "/index.html";
        }

        const filePath = path.resolve(
            __dirname,
            "." + requestedPath
        );

        fs.readFile(filePath, (error, content) => {

            if (error) {
                res.writeHead(404);
                  return res.end("File not found");
            }

            const extension = path.extname(filePath);    //Finds the extension of a file.

            const mimeTypes = {
                ".html": "text/html",
                ".css": "text/css",
                ".js": "text/javascript",
                ".json": "application/json",
                ".xml": "application/xml",
                ".png": "image/png",
                ".jpg": "image/jpeg",
            };

            res.writeHead(200, {
                "Content-Type":
                    mimeTypes[extension] || "application/octet-stream"
            });

            res.end(content);
        });

        return;
    }

    res.writeHead(405);
    res.end("Method not allowed");

});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
