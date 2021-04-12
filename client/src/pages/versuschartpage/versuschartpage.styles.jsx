import styled from 'styled-components';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 20px;
  align-items:center;
  border-radius: 25px;
  gap: 12px;
`;

export const VersusChartPageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Warning = styled.div`
  color: red;
`;
export const Title = styled.h1`
  color:gray;
  font-size:50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
`;

export const Description = styled.p`
  color:gray;
  font-size:35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 20px;
  align-items:center;
  border-radius: 25px;
  gap: 12px;
`;

export const ComposedChartGraphButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
`;