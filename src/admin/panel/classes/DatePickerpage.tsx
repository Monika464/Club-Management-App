import { DatePickerTrainings } from "./DatePickerTrainings";
import { ShowDays } from "./ShowDays";

//const DatePickerpages: React.FunctionComponent<PossibleTrainingDate[] >  =() => {
const DatePickerpages = () => {
  return (
    <div>
      <div>
        {" "}
        <DatePickerTrainings />
      </div>

      <div>
        <ShowDays />
      </div>
    </div>
  );
};

export default DatePickerpages;
