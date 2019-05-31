import users from '../modules/users/userModel';
import roles from '../modules/roles/roleModel';
import verification_code from '../modules/verificationCode/verificationModel';
import clients from '../modules/clients/clientModel';
import counter from '../modules/counter/counterModel';
import functions from '../modules/functions/functionsModel';
import event_logs from '../modules/eventLog/eventLogModel';
import debugger_logs from '../modules/debuggerLogs/logModel';
import asns from '../modules/ASN/ASNModel';
import inboundReceipt from '../modules/inboundReceipt/inboundModel';
import ncl_schema from '../modules/ncl/ncl_model';
import revision from '../modules/revisions/revisionModel';
import ctos from '../modules/ctos/ctosModel';
import ctosRevisionModel from '../modules/ctos/ctosRevisionModel';
import function6_1 from '../modules/function6/function6_1_Model';
import function6_2 from '../modules/function6/function6_2_Model';

var model = {
    users,
    roles,
    verification_code,
    clients,
    counter,
    functions,
    event_logs,
    debugger_logs,
    asns,
    inboundReceipt,
    revision,
    ncl_schema,
    ctos,
    ctosRevisionModel,
    function6_1,
    function6_2
};

export default model;
