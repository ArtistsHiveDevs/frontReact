import { EsMessages as BaseMessages } from "./es";

const exportMessages = JSON.parse(JSON.stringify(BaseMessages));

exportMessages.app.name = "Colombia";

export const EsCOMessages = exportMessages;
