import { Flex } from "@chakra-ui/react";
import UploadImage from "./components/UploadImage";

const App = () => {
  return (
    <Flex direction="column" align='center'>
      <UploadImage />
    </Flex>
  );
};
export default App;
