const data = {
    employees : require('../model/employees.json'),
    setEmployees: function (data){this.employees = data}
};
const path = require('path');
const fsPromises = require('fs').promises;


const getAllEmployees  = (req,res)=>{
    res.json(data.employees);
}

const createNewEmployee = async(req,res)=>{
const newEmployee = {
    id: (data.employees[data.employees.length-1].id)+1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
}
if(!newEmployee.firstname|| !newEmployee.lastname){
    return res.status(400).json({'message':'First and last name are required'});
}
data.setEmployees([...data.employees,newEmployee]);
// write employees to file
writeEmployeesToFile(data);
res.status(201).json(data.employees);
}

const updateEmployee = (req,res)=>{
const employee = data.employees.find(emp=>emp.id === parseInt(req.body.id));
if(!employee){
    return res.status(400).json({'message':`Employee ID ${req.body.id} not found`});
}
if(req.body.firstname) employee.firstname = req.body.firstname;
if(req.body.lastname) employee.lastname = req.body.lastname;
const filteredArray = data.employees.filter(emp=>emp.id !== parseInt(req.body.id));
const unsortedArray = [...filteredArray,employee];
data.setEmployees(unsortedArray.sort((a,b)=>a.id>b.id?1:a.id<b.id?-1:0));
writeEmployeesToFile(data);
res.json(data.employees);
}

const deleteEmpolyee = (req,res)=>{
const employee = data.employees.find(emp=>emp.id===parseInt(req.body.id));
if(!employee){
    return res.status(400).json({'message': `Employee ID ${req.body.id} not found`});
}
const filteredArray = data.employees.filter(emp=>emp.id !== parseInt(req.body.id));
data.setEmployees([...filteredArray]);
writeEmployeesToFile(data);
res.json(data.employees);
}

const getEmployee = (req,res)=>{
const employee = data.employees.find(emp=>emp.id === parseInt(req.params.id));
if(!employee){
    return res.status(400).json({'message':`Employee ID ${req.params.id} not found`})
}
    res.json(employee);
}

const writeEmployeesToFile = async (data)=>{
    await fsPromises.writeFile(path.join(__dirname,'..','model','employees.json'),JSON.stringify(data.employees));
};

module.exports = {getAllEmployees, createNewEmployee, updateEmployee, deleteEmpolyee, getEmployee}