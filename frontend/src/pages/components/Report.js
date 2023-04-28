import {
  Button,
  Flex,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
const Report = ({ transData }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const headerStyle = {
      fillColor: [1, 29, 56],
      textColor: [255, 255, 255],
      fontSize: 14,
      fontStyle: "bold",
    };

    const alternateRowStyle = {
      fillColor: [220, 220, 220],
    };

    const rowStyle = {
      fillColor: [255, 255, 255],
      textColor: [50, 50, 50],
      fontSize: 12,
      fontStyle: "normal",
    };

    doc.autoTable({
      html: "#my-table",
      startY: 30,
      styles: {
        header: headerStyle,
        body: rowStyle,
        alternateRow: alternateRowStyle,
      },
      margin: { top: 30 },
    });
    doc.save("transactions.pdf");
  };
  return (
    <>
      <Button size={"md"} onClick={generatePDF} leftIcon={<Icon color='red.500' as={BsFillFileEarmarkPdfFill} />}>
        Generate
      </Button>
      <Flex justifyContent={"center"} hidden>
        <Table
          textAlign={"center"}
          size={{ base: "sm", sm: "md", md: "lg" }}
          width={"100%"}
          overflowX={"auto"}
          id="my-table"
        >
          <Thead>
            <Tr>
              <Th>Text</Th>
              <Th>Transfer</Th>
              <Th>Category</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transData &&
              transData.data.map((trans, i) => {
                return (
                  <Tr>
                    <Td>{trans.text}</Td>
                    <Td>{trans.transfer}</Td>
                    <Td>{trans.category.name}</Td>
                    <Td color={trans.amount < 0 ? "red" : "green"}>
                      {trans.amount}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Flex>
    </>
  );
};

export default Report;
