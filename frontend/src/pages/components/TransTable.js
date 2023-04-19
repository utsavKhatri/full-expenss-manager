import { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tooltip,
  Button,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import UpdateTransactions from "./UpdateTrans";

function TransactionTable({ transData, fetchSignleAcc }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(transData.data.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = transData.data.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <>
      <Table textAlign={"center"}>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>Text</Th>
            <Th>Transfer</Th>
            <Th>Category</Th>
            <Th isNumeric>Amount</Th>
            <Th width={"-moz-fit-content"} colSpan={2} textAlign={"center"}>
              Action
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentRows.map((trans, i) => {
            return (
              <Tooltip
                label={`last updated by ${trans.updatedBy}`}
                key={trans.id}
              >
                <Tr>
                  <Td flexDirection={"row"} alignItems={"center"}>
                    {i + 1 + (currentPage - 1) * rowsPerPage}
                  </Td>
                  <Td>{trans.text}</Td>
                  <Td>{trans.transfer}</Td>
                  <Td>{trans.category}</Td>
                  <Td color={trans.amount < 0 ? "red" : "green"}>
                    {trans.amount}
                  </Td>
                  <Td width={"-moz-fit-content"}>
                    <UpdateTransactions
                      transId={trans.id}
                      fetchSignleAcc={fetchSignleAcc}
                    />
                  </Td>
                  <Td width={"-moz-fit-content"}>
                    <Button
                      onClick={() => deleteTrans(trans.id)}
                      leftIcon={<DeleteIcon />}
                      color={"red.600"}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              </Tooltip>
            );
          })}
        </Tbody>
      </Table>
      <Flex>
        {pageNumbers.map((number) => {
          return (
            <Button
              key={number}
              id={number}
              colorScheme={currentPage === number ? "blue" : "gray"}
              onClick={handleClick}
              size={"sm"}
            >
              {number}
            </Button>
          );
        })}
      </Flex>
    </>
  );
}

export default TransactionTable;
