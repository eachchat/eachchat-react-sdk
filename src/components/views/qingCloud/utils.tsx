import createRoom from "../../../createRoom";
import { MatrixClientPeg } from "../../../MatrixClientPeg";
import SdkConfig from "../../../SdkConfig";
import { findDMForUser } from "../../../utils/dm/findDMForUser";

export const autoAddRobot = ()=>{
    const cli = MatrixClientPeg.get();
    const robot_name =SdkConfig.get("setting_defaults").robot_name;
    const exitRoom = findDMForUser(cli, robot_name);
    if(!exitRoom){
        createRoom({
            dmUserId: robot_name,
        });
    }
}