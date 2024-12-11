export interface IApplicationProps {}
import React from "react";
import { FormEvent, useContext, useState } from "react";
import { useMultistepForm } from "./useMultiStepForm";
import "./Signup2.css";
import { StartAndOptionForm } from "./StartEndOptionsForm";
import { UserForm } from "./UserForm";
//import { useSingnInToBase } from '../hooks/useSigninToBase';
import { SigninSendingTest } from "./SigninSendingTest";
import SetAvatar from "../../../utils/components/SetAvatar";
import { UserContext } from "../../../utils/auth/UserContext";
import { updateProfile } from "firebase/auth";
import { useLanguage } from "../../../utils/context/LanguageContext";
import translations from "./signup2-translations";

export interface IdateObj {
  toMillis(): number | Date;
  seconds: number;
  nanoseconds: number;
}

const Signup2: React.FunctionComponent<IApplicationProps> = () => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [dob, setDob] = useState<Date>(new Date());
  const [option, setOption] = useState<string | null>("");

  const [startDay, setStartDay] = useState<IdateObj | null>(null);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string>("");
  const [pictureURL, setPictureURL] = useState<string>("");
  const { currentUser } = useContext(UserContext);

  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage as "en" | "pl"];

  const updatingProfile = async () => {
    if (currentUser) {
      await updateProfile(currentUser, {
        photoURL: pictureURL,
      })
        .then(() => {
          console.log("Profile updated!");
        })
        //.then(() => {
        // navigate('/userpanel', { replace: true });
        //})
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm([
      <UserForm
        setName={setName}
        name={name}
        setSurname={setSurname}
        surname={surname}
        dob={dob}
        setDob={setDob}
      />,
      <StartAndOptionForm
        option={option}
        setOption={setOption}
        startDay={startDay}
        setStartDay={setStartDay}
      />,
      // <AccountForm
      // email ={email}
      // setEmail={setEmail}
      // password={password}
      // setPassword={setPassword}
      // />,
      <SetAvatar
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        thumbnailError={thumbnailError}
        setThumbnailError={setThumbnailError}
        pictureURL={pictureURL}
        setPictureURL={setPictureURL}
        updatingProfile={updatingProfile}
      />,
    ]);

  <SigninSendingTest
    name={name}
    surname={surname}
    dob={dob}
    option={option}
    startDay={startDay}
    //email ={email}
    //password={password}
    // pictureURL ={pictureURL}
  />;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep) return next();
    alert("Successful  Creation");
  }

  return (
    <div>
      <div className="signupForm">
        <form onSubmit={onSubmit}>
          <div className={"pageNum"}>
            {currentStepIndex + 1}/{steps?.length}
          </div>
          {step}

          <div className="pageContent">
            {!isFirstStep && (
              <button type="button" onClick={back}>
                Back
              </button>
            )}
            {/*<button type="button" onClick={next}>{isLastStep? "Finish": "Next"}</button>*/}
            {!isLastStep && (
              <button type="button" onClick={next}>
                Next
              </button>
            )}
          </div>
        </form>
        {/* {isLastStep && <button onClick={handleCreateUser}>Create User</button>} */}
        <div>
          <span className="decript">{t.name}</span>
          <span> {name} </span>
          <span className="decript">{t.surname} </span> <span>{surname} </span>
          <br></br>
          <span className="decript">{t.dob}</span>
          <span>{dob.toDateString()}</span>
        </div>
        {/* {startDay && <div><span className='decript'>start: </span> <span>{startDay?.toDate().toDateString()} </span></div>} */}
        {startDay && (
          <div>
            <span className="decript">start: </span>{" "}
            <span>{new Date(startDay?.toMillis()).toDateString()} </span>
          </div>
        )}
        {option && (
          <div>
            <span className="decript">{t.type} </span> <span>{option}</span>
          </div>
        )}

        {/* {isLastStep && <SigninSendingTest name={null} surname={null} dob={undefined} startDay={undefined} option={''} email={email} password={password}/>} */}
        {/* {isLastStep && <SigninSendingTest name={name} surname={surname} dob={dob} startDay={startDay} option={option} email={email} password={password}/>} */}
        {isLastStep && (
          <SigninSendingTest
            name={name}
            surname={surname}
            dob={dob}
            startDay={startDay}
            option={option}
          />
        )}
      </div>
    </div>
  );
};

export default Signup2;
