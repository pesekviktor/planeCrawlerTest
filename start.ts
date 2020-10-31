import { getCrawler } from "./crawler";
import { getHasMine } from "./hasMine";

let crawler = getCrawler(getHasMine(23));
console.log(crawler());
