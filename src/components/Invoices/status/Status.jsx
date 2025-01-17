import { capitalizeFirstLetter } from "../../utility/globalFunction";
import { Circle,StyledStatus } from "./StatusStyles";


const Status = ({ currStatus, ...props }) => {
    return (
        <StyledStatus $statusType={currStatus} {...props}>
            <Circle $statusType={currStatus} />
            {capitalizeFirstLetter(currStatus)}
        </StyledStatus>
    );
};

export default Status;