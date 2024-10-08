import styled from "styled-components";
import Seasons from "../components/Quest/Seasons";
import Stamp from "../components/Quest/Stamp";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { questDataState, selectedSeasonState } from "../state/atom";
import { fetchData } from "../api/FetchData";
import { API_URL } from "../api/apiUrl";
import { useLanguage } from "../helpers/languageUtils";

const QuestLayout = styled.div`
  width: 100%;
  height: calc(
    100vh - 100px
  ); /* 100vh에서 Header와 Footer의 높이(50px씩)를 뺀 값 */
  background-color: white;
`;

const Quest = () => {
  const { language } = useLanguage();
  const [selectedSeason, setSelectedSeason] =
    useRecoilState(selectedSeasonState);
  const [animateId, setAnimateId] = useState(null);
  const [questDataBySeason, setQuestDataBySeason] =
    useRecoilState(questDataState);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // 초기값을 null로 설정하여 로그인 상태 확인 전을 구분

  // 토큰 유효성 검사 및 로그인 상태 확인
  useEffect(() => {
    const checkAuthentication = async () => {
      let accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const response = await fetchData(
            `${API_URL}/api/auth/check-token`,
            "GET",
            language
          );
          console.log("accesstoken유효성검사:", response);
          if (response.data.valid) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error validating token:", error);
          setIsLoggedIn(false); // 오류 발생 시 로그인 상태를 false로 설정
        }
      } else {
        setIsLoggedIn(false); // 액세스 토큰이 없을 때도 false로 설정
      }
    };
    checkAuthentication();
  }, []);

  //데이터 받아오기 (로그인 안해도 데이터 받아와짐)
  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const response = await fetchData(
          `${API_URL}/api/quests?season=${selectedSeason}`,
          "GET",
          language
        );
        if (response.data) {
          // 데이터가 있는 경우 상태 업데이트
          setQuestDataBySeason(response.data);
          console.log("questDataBySeason", response.data);
        } else {
          // 데이터가 없는 경우 상태 업데이트
          console.log("no data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStamps();
  }, [selectedSeason, language]);

  // URL 쿼리 파라미터에서 animateId를 가져오는 로직
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("animateId");
    if (id) {
      setAnimateId(id);
    }
  }, [location.search]);

  return (
    <QuestLayout>
      <QuestLayout>
        <Seasons />
        <Stamp
          animateId={animateId}
          setAnimateId={setAnimateId}
          isLoggedIn={isLoggedIn}
        />
      </QuestLayout>
    </QuestLayout>
  );
};

export default Quest;
