import React from 'react'

export function Untitled1(props) {
     
     // const LecturesData = {
     //      department: "Engineering",
     //      year: "1st-Year",
     //      branch: "CSE A",
     //      todaysLectureStatus: [{
     //      }],
     // const [attendanceList, setAttendanceList] = useState([]);
     var obj = [{ name: "arpit" }];
     attendanceList = obj;
     console.log(attendanceList);
     setAttendanceList((prev) => {
          [...prev, { name: "anuj" }]
     });
     console.log(attendanceList);

     //      subjectsData: [
     //           {
     //                id: 1,
     //                subName: "Chemistry",
     //                code: "bt101",
     //                teacher: "Pro. Jeena Harjit",
     //                status: "pending",
     //                code: 0,
     //           },
     //           {
     //                id: 2,
     //                subName: "Mathematics",
     //                code: "bt102",
     //                teacher: "Pro. Jeena Harjit",
     //                status: "pending",
     //                code: 0,
     //           },
     //           {
     //                id: 3,
     //                subName: "Engineering Graphics",
     //                code: "bt105",
     //                teacher: "Pro. Jeena Harjit",
     //                status: "pending",
     //                code: 0,
     //           },
     //           {
     //                id: 4,
     //                subName: "Basic Electrical and Electronics Engineering",
     //                code: "bt104",
     //                teacher: "Pro. Jeena Harjit",
     //                status: "pending",
     //                code: 0,
     //           },
     //           {
     //                id: 5,
     //                subName: "Englich Communication",
     //                code: "bt103",
     //                teacher: "Pro. Jeena Harjit",
     //                status: "pending",
     //                code: 0,
     //           },
     //      ]
     // }

     // const SubjectDetails = LecturesData.subjectsData;


     return (
          <>
               
          </>
     )
}
