import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { mockSeasonPlantList } from "../../list/mockData";
import { fetchData } from "../../api/FetchData";
import { useRecoilState } from "recoil";
import { questDataState, selectedSeasonState } from "../../state/atom";
import { API_URL } from "../../api/apiUrl";

const heightExpand = keyframes`
  from{
    height: 0;
    background-color: rgba(255,255,255,0)
  } to{
    height: 200px;
    background-color: rgba(255,255,255,1)
  }
`;

const appear = keyframes`
from{    
    opacity:0;
  } to{    
    opacity:1;
  }  
`;

const TextAreaLayout = styled.div`
  width: 100%;
  height: 35%;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PlantListToggle = styled.div`
  width: 95%;
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
  cursor: pointer;
`;

const StyledIoMdArrowDropdown = styled(IoMdArrowDropdown)`
  font-size: 1.25rem;
`;

const PlantToggleEmoji = styled.span``;

const PlantList = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 8px;
  z-index: 1;
  padding: 10px 15px 20px 15px;
  cursor: pointer;
  box-shadow: 0px 10px 10px 5px rgba(0, 0, 0, 0.25);
  animation: ${heightExpand} 0.2s ease-out forwards;
`;

const PlantListItem = styled.div`
  animation: ${appear} 0.1s ease-out forwards;
  animation-delay: 0.2s; /* plantList 애니메이션 이후에 시작되도록 지연 설정 */
  opacity: 0; /* 애니메이션이 시작되기 전에는 숨김 */
`;

const TextAreaContainer = styled.textarea`
  width: 100%;
  height: 100px;
  border: none;
  font-size: 1rem;
  resize: none; /* 크기 조정 불가능 */
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.lightgrey1};
  line-height: 1.5;
  padding: 8px 10px;
`;

const DateLocationContainer = styled.div`
  width: 95%;
  height: 30px;
  font-size: 0.875rem;
  border-bottom: 1px solid lightgrey;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const AddLocationBtn = styled.button`
  background: none; /* 배경색 제거 */
  border: none; /* 테두리 제거 */
  padding: 0; /* 기본 패딩 제거 */
  margin: 0; /* 기본 마진 제거 */
  font: inherit; /* 부모 요소의 폰트 스타일을 상속받음 */
  cursor: pointer; /* 클릭할 수 있음을 나타내는 커서 */
  box-shadow: none; /* 기본 박스 그림자 제거 */
  text-align: inherit; /* 텍스트 정렬 상속 */
  appearance: none; /* 브라우저 기본 스타일 제거 */
  outline: none; /* 포커스 시 나타나는 외곽선 제거 */
`;

const TextArea = ({
  value,
  onChange,
  handleDate,
  plant,
  setPlant,
  setPlantId,
  isMapOpen,
  setIsMapOpen,
  markerPosition,
}) => {
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const [questDataBySeason, setQuestDataBySeason] =
    useRecoilState(questDataState);
  const [seasonplantList, setSeasonplantList] = useState(mockSeasonPlantList);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  handleDate(formattedDate);

  const handleplantSelection = (plantName, plantId) => {
    console.log("trying handle plant selection");
    console.log("questDataBySeason", questDataBySeason);
    setPlant(plantName); // 선택된 꽃으로 상태 업데이트
    setPlantId(plantId);
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  const locationBtnClickHandler = () => {
    console.log("Button clicked"); // 상태 업데이트 로그
    setIsMapOpen(true);
    console.log("isMapOpen:", true);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log(isDropdownOpen); //함수가 비동기적으로 동작해서 열렸을때 false가 찍힘. 기능적으로는 이상이 없어서 수정하지 않음
  };

  // useEffect(() => {
  //   const fetchplantData = async () => {
  //     try {
  //       console.log("trying fetch");
  //       const response = await fetchData(
  //         `${API_URL}/api/quests?season=${selectedSeason}`
  //       ); //fetchData함수 외부에선언함 (api폴더)

  //       console.log("seasonplantlist:", response);
  //       setSeasonplantList(response);
  //     } catch (error) {
  //       console.error("Error fetching plant data:", error);
  //     }
  //   };

  //   fetchplantData();
  // }, []);

  return (
    <TextAreaLayout>
      <PlantListToggle onClick={handleDropdownToggle}>
        {plant}
        {plant == "Select a plant" ? (
          <StyledIoMdArrowDropdown />
        ) : (
          <plantToggleEmoji>🌿</plantToggleEmoji>
        )}
      </PlantListToggle>
      {isDropdownOpen && (
        <PlantList>
          {questDataBySeason.plantData.plants.map((item) => (
            <PlantListItem
              key={item.plantId}
              onClick={() => handleplantSelection(item.plantName, item.plantId)}
            >
              {item.plantName}
            </PlantListItem>
          ))}
        </PlantList>
      )}
      <TextAreaContainer
        placeholder="Tell us about your discovery!"
        value={value}
        onChange={onChange}
      />
      <DateLocationContainer>
        {formattedDate}/{" "}
        <AddLocationBtn type="button" onClick={locationBtnClickHandler}>
          {markerPosition.latitude && markerPosition.longitude ? (
            <div>Location Added</div>
          ) : (
            <div>Add Location</div>
          )}
        </AddLocationBtn>
      </DateLocationContainer>
    </TextAreaLayout>
  );
};

export default TextArea;
