import { format,} from "date-fns";
import { pl } from "date-fns/locale";

export interface IDateFnsFormatProps{
element: Date | any;
}




const DateFnsFormat : React.FunctionComponent<IDateFnsFormatProps> =(props) => {

    //console.log("elem z propsow",format(props.element.toDate(), 'PPP', {locale: pl}))
    //console.log("elem z propsow",typeof(props.element))
   
    return(<>
    {props.element && <>{format(props.element?.toDate(), 'PPP', {locale: pl})}</>}
    </>)

}

export default DateFnsFormat;  