import { useState, useRef, useEffect } from "react";
import Pageheader from "../../../components/common/pageheader/pageheader";
import axios from "axios";
import Slider from "react-slick";
import SuccessAlert from '../../../components/ui/alerts/SuccessAlert';
import "../../../assets/css/style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

interface Project {
    product_image: string;
    product_link: string;
  }
  

const AddProject = () => {
  const [project, setProject] = useState<Project[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  
  const [fileDetails, setFileDetails] = useState<{ url: string, name: string }[]>([]);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [imageUrl, setImageUrl] = useState('');
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [imageAddUrl, setImageAddUrl] = useState<string[]>([]); 

  const notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
        duration: 3000, 
    });

  useEffect(() => {
    document.title = 'Projects';

    if (showSuccessAlert) {
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "/api/method/reward_management_app.api.projects.get_project"
        );
      if (response) {
                    console.log("project response", response)
                }

                if (response && response.data?.message?.success === true) {
                    // Get product data from the response
                    const products = response.data.message.product || [];
                    setProject(products); 
                  } else {
                    setProject([]); 
                  }
            } catch (error) {
                console.error("Error fetching instructions:", error);
            } finally {
                setLoading(false);
            }
        };


    fetchProjects();
  }, [showSuccessAlert]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    pauseOnHover: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlideIndex(current),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      if (fileArray.length + fileDetails.length > 10) {
        setError('You can only select up to 10 images!');
        return;
      } else {
        setError('');
      }

      const newFileDetails = fileArray.map((file) => {
        const reader = new FileReader();
        return new Promise<{ url: string, name: string }>((resolve) => {
          reader.onload = (event) => {
            resolve({
              url: event.target?.result as string,
              name: file.name,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newFileDetails).then((newDetails) => {
        setFileDetails((prevFiles) => [...prevFiles, ...newDetails]);

      });
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFileDetails((prevFiles) =>
        prevFiles.filter((_, index) => index !== indexToRemove)
    );
   
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("is_private", "0");
    formData.append("folder", "");
    formData.append("file_name", file.name);

    try {
      const response = await axios.post(`/api/method/upload_file`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      if (response && response.data.message && response.data.message.file_url) {
        return response.data.message.file_url;
      } else {
        console.error("File URL not found in response:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
// update project------
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const uploadedFileURLs: string[] = [];

    try {
      for (const fileDetail of fileDetails) {
        const fileBlob = await fetch(fileDetail.url).then(res => res.blob());
        const file = new File([fileBlob], fileDetail.name, { type: fileBlob.type });
        const fileURL = await uploadFile(file);
        if (fileURL) {
          uploadedFileURLs.push(fileURL);
        }
      }

      const data = {
        selected_images: uploadedFileURLs,
        selected_descriptions: [imageUrl],
      };

      const response = await axios.post('/api/method/reward_management_app.api.projects.add_update_project', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      const result = response.data;

      if (result.message && result.message.status === 'success') {
        setAlertMessage("Project Update successfully!");

        setShowSuccessAlert(true);
        setFileDetails([]);
        setImageUrl('');
      } else {
        alert("Error updating instructions: " + (result.message.message || "Unknown error."));
      }
    } catch (error) {
      console.error("Error during file upload or API call:", error);
      alert("An error occurred. Please try again.");
    }
  };

//   handle edit project

  const handleEditGuide = (instruction: any) => {
    setProjectToEdit(instruction);
    setImageUrl(instruction.image_description);
    setFileDetails([{ url: instruction.project_link, name: instruction.project_image.split('/').pop() }]);
    setShowAddProjectForm(false);

  }

  const handleCloseModal = () => {
    setProjectToEdit(null);
    setShowAddProjectForm(false);
    setImageUrl('');
    setFileDetails([]);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const handleAddNewGuide = () => {
    
    setProjectToEdit(null);
    setShowAddProjectForm(true);
  };

 // Save URL data
const handleProjectLinkChange = (index: number, value: string) => {
    const updatedUrls = [...imageAddUrl]; 
    updatedUrls[index] = value; 
    setImageAddUrl(updatedUrls);  
    console.log("Updated URLs:", updatedUrls); 
  };
  
  // New project add
  const handleAddSubmit = async (event) => {
    event.preventDefault(); 
    
    const uploadedFileURLs: string[] = [];

    fileDetails.forEach((fileDetail, index) => {
      handleProjectLinkChange(index, fileDetail.projectLink || '');
    });
  
 
    // console.log("Image Add URLs after update:", imageAddUrl); 
  
    try {
      // Upload files to get URLs
      for (const fileDetail of fileDetails) {
        const fileBlob = await fetch(fileDetail.url).then((res) => res.blob());
        const file = new File([fileBlob], fileDetail.name, { type: fileBlob.type });
        const fileURL = await uploadFile(file); 
        if (fileURL) {
          uploadedFileURLs.push(fileURL);
        }
      }


    if(uploadedFileURLs.length <2 || imageAddUrl.length <2) {
        notyf.error("Please add at least two image and two project link.");


        // setError('Please add two images and url!');
        return;
    }

  
     
      if (uploadedFileURLs.length !== imageAddUrl.length) {
        setError('The number of images must match the number of descriptions!');
        return;
      }
  
      const data = {
        new_image_url: uploadedFileURLs, 
        image_description: imageAddUrl,  
      };
  
    //   console.log("Data to be sent:", data);  
  
      // Post the data to your API endpoint
      const response = await axios.post('/api/method/reward_management_app.api.projects.add_new_project', data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      // Handle the response from the server
      const result = response.data;
      if (result.message && result.message.status === 'success') {
        setAlertMessage("Project Added successfully!");
        setShowSuccessAlert(true); 
        setFileDetails([]);  
        setImageUrl('');  
      } else {
        alert('Error updating project: ' + (result.message.message || 'Unknown error.'));
      }
  
    } catch (error) {
      console.error('Error during file upload or API call:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  return (
    <>
      <Pageheader
        currentpage={"Projects"}
        activepage={"/projects"}
        activepagename="Projects"
      />

      <div className="grid grid-cols-12 gap-x-6 p-6">
        {/* <div className="col-span-12 flex justify-between items-center">
          <h2 className="text-[var(--primaries)] text-xl font-semibold">Projects</h2>
        </div> */}

        <div className="col-span-12 mt-6">
          <div className="bg-white rounded-lg shadow-lg p-6 ">
            <div className="col-span-12 flex justify-between items-center">
            <h3 className="text-center text-defaulttextcolor box-title text-[.9375rem] font-bold mb-4">
              Project Gallery
            </h3>
            <button
            onClick={handleAddNewGuide}
            className="ti-btn !py-1 !px-2 text-xs !text-white !font-medium bg-[var(--primaries)]"
          >
            Add New Project
          </button>
          </div>

            <div className="relative pb-10 p-10 mx-auto">
              <Slider {...sliderSettings} ref={sliderRef}>
                {project.map((project, index) => (
                  <div key={index} className={index === 0 ? "first-slide" : ""} >
                    <div className="mx-[10px]">
                    <div className=" text-sm text-defaulttextcolor flex justify-between pb-3 items-center">
                    <h3 className="text-defaulttextcolor box-title text-[.9375rem] font-bold mb-4 ">
                                                Project Image
                                            </h3>
                      <button onClick={() => handleEditGuide(project)} className="ti-btn !py-1 !px-2 text-xs !text-white !font-medium bg-[var(--primaries)]">Edit</button>
                      
                    </div>
                  <div className="flex justify-center">
                  <img
                      src={`${window.origin}${project.product_image}`}
                      alt={`Guide ${index + 1}`}
                      className="w-full h-[500px] rounded-md object-fill"
                    />
                  </div>
        
                   
                 
                    <div className="flex  pt-3"> 
                    <h3 className="text-defaulttextcolor box-title text-[.9375rem] font-bold mb-4">
                                                Project Link
                                            </h3>
                    </div>
                        <div className="p-3 w-full rounded-[5px] text-defaulttextcolor text-sm border border-[#dadada] ">{project.product_link}
                    </div>
                  </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
      {/* show add new project model------ */}

      {showAddProjectForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center border-b border-defaultborder pb-2 p-4">
              <h6 className="text-primary font-semibold">Add Project</h6>
              <button onClick={handleCloseModal} className="text-defaulttextcolor">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4">
              <div className="p-4">
                <div>
                  <label
                    htmlFor="file-upload"
                    className="block text-sm text-defaulttextcolor font-semibold"
                  >
                    Project Image
                  </label>
                  <input
                    type="file"
                    multiple
                    id="file-upload"
                    className="mt-1 block w-full p-2 border border-[#dadada] rounded-[5px]"
                    onChange={handleFileChange}
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <div className="grid grid-cols-1 gap-5 mt-4">
                  {fileDetails.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-40 object-contain rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-[-10px] right-[50px] bg-red-600 text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <i className="ri-close-line text-primary text-lg font-bold"></i>
                      </button>
                      {/* URL input for each image */}
                      <label className="block text-sm text-defaulttextcolor font-semibold"> Project Link</label>
                      <input
                   type="text"
                   placeholder="Project Link"
                   value={imageAddUrl[index] || ''}  
                   onChange={(e) => handleProjectLinkChange(index, e.target.value)} 
                   className="mt-2 block w-full p-2  border border-[#dadada] rounded-[5px] text-sm"
                 />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-defaultborder p-4 items-baseline">
                <button
                  type="submit"
                  className="ti-btn ti-btn-primary-full bg-primary me-2"
                >
                  Add Project
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* show edit project model------ */}

      {projectToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center border-b pb-2 p-4">
              <h6 className="text-primary font-semibold">
                Edit Project
              </h6>
              <button onClick={handleCloseModal} className="text-defaulttextcolor">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="p-4">
              <div>
                <label htmlFor="file-upload" className="block text-sm text-defaulttextcolor font-semibold">
                  Project Image
                </label>
                <input
                  type="file"
                  multiple
                  id="file-upload"
                  className="mt-1 block w-full p-2 border border-[#dadada] rounded-[5px]"
                  onChange={handleFileChange}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="grid grid-cols-3 gap-5 mt-4">
                {fileDetails.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-28 object-contain rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-[-10px] right-[-10px] bg-red-600 text-primary p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                       <i className="ri-close-line text-primary text-lg font-bold "></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="">
                <label
                  htmlFor="image-description"
                  className="block text-sm text-defaulttextcolor font-semibold"
                >
                  Project Link
                </label>
                <input
                  id="image-description"
                  placeholder="Project Link"
                  className="mt-1 p-2 w-full border border-[#dadada] rounded-[5px] text-sm"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-defaultborder p-4 items-baseline">
                <button
                  type="submit"
                  className="ti-btn ti-btn-primary-full bg-primary me-2 "
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="ti-btn ti-btn-success bg-defaulttextcolor ti-btn text-white !font-medium m-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessAlert && <SuccessAlert 
      message={alertMessage} 
      onClose={function (): void {
        throw new Error("Function not implemented.");
      } } 
      onCancel={function (): void {
        throw new Error("Function not implemented.");
      } } />}
    </>
  );
};


export default AddProject;
