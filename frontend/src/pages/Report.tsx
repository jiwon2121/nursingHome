import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import getReportInfo from '../services/report/getReportInfo';
import ReportTitle from '../components/report/ReportTitle';
import ReportSubject from '../components/report/ReportSubject';
import ReportHealthContent from '../components/report/ReportHealthContent';
import ReportLifeContent from '../components/report/ReportLifeContent';
import FlexColContainer from '../components/common/FlexColContainer';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import PieChart from '../components/chart/PieChart';
import styled from 'styled-components';
import LineChart from '../components/chart/LineChart';
import { blue, failed, gray } from '../assets/styles/palettes';

function Report() {
  const navigator = useNavigate();
  const params = useParams<{ id: string; yearMonth: string }>();
  console.log(params.id);
  const [reportInfo, setReportInfo] = useState<ReportInfo>();
  console.log(reportInfo);

  useEffect(() => {
    async function fetchReportInfo() {
      const result =
        params.id && params.yearMonth
          ? await getReportInfo(params.id, params.yearMonth)
          : null;
      if (result !== null) {
        setReportInfo(result);
        return;
      }
      navigator('not_found');
    }
    fetchReportInfo();
  }, []);

  const condition = {
    good: 15,
    normal: 14,
    bad: 10,
  };

  const sugarData = reportInfo?.sugar.data.map((d) => {
    const avg = (d.low + d.high) / 2;
    return { x: d.day, y: avg };
  });

  const lowData = reportInfo?.pressure.data.map((d) => {
    return { x: d.day, y: d.low };
  });

  const highData = reportInfo?.pressure.data.map((d) => {
    return { x: d.day, y: d.high };
  });

  return (
    <div>
      {reportInfo && (
        <FlexColContainer $alignItems="start" $padding="0.5rem" $width="96%">
          <ReportTitle
            year={reportInfo.year}
            month={reportInfo.month}
            permission="하늘선요양원"
            target="이복순"
          />
          <ReportSubject subject="1. 건강 정보" />
          <ReportHealthContent
            title="1-1. 혈압 정보"
            content={reportInfo?.pressure?.insights}
          >
            {lowData && highData ? (
              <Canvas>
                <ParentSize>
                  {({ width: visWidth }) => (
                    <LineChart
                      width={visWidth}
                      height={(visWidth * 3) / 4}
                      data={[lowData, highData]}
                      keys={['이완기', '수축기']}
                      colors={[blue, failed]}
                      domain={[0, 200]}
                    />
                  )}
                </ParentSize>
              </Canvas>
            ) : null}
          </ReportHealthContent>
          <ReportHealthContent
            title="1-2. 혈당 정보"
            content={reportInfo?.sugar?.insights}
          >
            {sugarData ? (
              <Canvas>
                <ParentSize>
                  {({ width: visWidth }) => (
                    <LineChart
                      width={visWidth}
                      height={(visWidth * 3) / 4}
                      data={[sugarData]}
                      keys={['평균 혈당']}
                      colors={[blue]}
                      domain={[0, 300]}
                    />
                  )}
                </ParentSize>
              </Canvas>
            ) : null}
          </ReportHealthContent>
          <ReportSubject subject="2. 생활 정보" />
          <ReportLifeContent
            title="2-2. 생활 정보 요약"
            content={reportInfo?.lifeInfo}
          >
            <Canvas>
              <ParentSize>
                {({ width: visWidth }) => (
                  <PieChart
                    width={visWidth}
                    height={(visWidth * 3) / 4}
                    data={condition}
                  />
                )}
              </ParentSize>
            </Canvas>
          </ReportLifeContent>
          <ReportSubject subject="3. 생활 영상" />
          {/* <video src={reportInfo.movie} /> */}
          <iframe
            width="99%"
            height="50%"
            src="https://www.youtube.com/embed/qfmdXoSlceU?si=XMPQ2aGt7jnCo-Zf"
            title="YouTube video player"
            frameBorder="7"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
          <FlexColContainer>
            <Message>
              갑진년 새해 복<br />
              많이 받으세요
              <br />
            </Message>
          </FlexColContainer>
        </FlexColContainer>
      )}
    </div>
  );
}

const Message = styled.h3`
  text-align: center;
`;

const Canvas = styled.div`
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 0 3px ${gray};
`;

export default Report;
