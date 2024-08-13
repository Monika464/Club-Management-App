import AttendanceList from "./AttendanceList";

export interface IAttendancepage {}

const Attendancepage: React.FunctionComponent<IAttendancepage> = () => {
  return (
    <div>
      <div>
        {" "}
        <AttendanceList />
      </div>
    </div>
  );
};

export default Attendancepage;
