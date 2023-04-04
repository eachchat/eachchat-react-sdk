import createRoom from "../../../createRoom";
import { MatrixClientPeg } from "../../../MatrixClientPeg";
import SdkConfig from "../../../SdkConfig";
import { findDMForUser } from "../../../utils/dm/findDMForUser";

export const autoAddRobot = ()=>{
    const cli = MatrixClientPeg.get();
    const robot_id =SdkConfig.get("setting_defaults").robot_id;
    const exitRoom = findDMForUser(cli, robot_id);
    if(!exitRoom){
        createRoom({
            dmUserId: robot_id,
        });
    }
}