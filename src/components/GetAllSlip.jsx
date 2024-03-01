import { useState, useEffect } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Spinner, // Import Spinner component from Chakra UI
} from "@chakra-ui/react";
import axios from "axios";
import InfoModal from "./common/InfoModal";
import { GoPlus } from "react-icons/go";
import TableContainer from "./common/TableContainer";
import { Link } from "react-router-dom";
import { Empty } from "antd";

const CreateProjectButton = ({ onOpen }) => {
  return (
    <Link to="/createSlip">
      <Button
        colorScheme="blue"
        onClick={onOpen}
        _hover={{ bg: "blue.600" }}
        mb="2"
        className="flex gap-2 items-center"
      >
        <GoPlus /> Create Slip
      </Button>
    </Link>
  );
};

const GetAllSlip = () => {
  const [projects, setProjects] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/admin/getAllSlips`
        );
        setProjects(response.data);
        setIsLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); 
      }
    }
    fetchData();
  }, []);

  const handleMoreInfo = (project) => {
    setSelectedProject(project);
    onOpen();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="purple.500" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-8">
        <h1 className="text-3xl font-bold mb-4">Slip Information</h1>
        <CreateProjectButton onOpen={onOpen} />
        {projects.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>No Slip Assigned</span>}
          />
        ) : (
          <TableContainer
            formFor="project"
            searchText={searchText}
            setSearchText={setSearchText}
            setFilteredData={setFilteredProjects}
            data={projects}
          >
            <Thead bg={"#F1F5F9"}>
              <Tr>
                <Th fontWeight="bold">S. No.</Th>
                <Th fontWeight="bold">Employee name</Th>
                <Th fontWeight="bold">Basic Pay</Th>
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Travel Pay
                </Th>
             
                <Th fontWeight="bold" className="md:table-cell hidden">
                  Bonus
                </Th>
               

                <Th fontWeight="bold">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {searchText !== ""
                ? filteredProjects.map((project, index) => (
                    <Tr key={project._id}>
                      <Td>{index + 1}</Td>
                      <Td>{index + 1}</Td>
                      <Td>{project.basicPay}</Td>
                      <Td className="md:table-cell hidden">
                        {project.travelPay}
                      </Td>
                      <Td className="md:table-cell hidden">{project.bonus}</Td>
                      <Td>
                        <Button
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(project)}
                        >
                          More Info
                        </Button>
                      </Td>
                    </Tr>
                  ))
                : projects.map((project, index) => (
                    <Tr key={project._id}>
                      <Td>{index + 1}</Td>
                      <Td>{index + 1}</Td>
                      <Td>{project.basicPay}</Td>
                      <Td className="md:table-cell hidden">
                        {project.travelPay}
                      </Td>
                      <Td className="md:table-cell hidden">{project.bonus}</Td>
                      <Td>
                        <Button
                          colorScheme="purple"
                          onClick={() => handleMoreInfo(project)}
                        >
                          More Info
                        </Button>
                      </Td>
                    </Tr>
                  ))}
            </Tbody>
          </TableContainer>
        )}
      </div>

      <InfoModal
        modalFor="slip"
        data={selectedProject}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};

export default GetAllSlip;
