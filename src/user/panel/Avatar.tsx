export interface IAvatarProps {
    src:  string; 
};
import './avatar.css'

    const Avatar: React.FunctionComponent<IAvatarProps> =(props) => {

        return(
        <div className="avatar">
            <img src={props.src} alt={"user avatar"}/>
        </div>)


    }

    export default Avatar;