import styled from 'styled-components';

export const NotFoundPageWrapper = styled.div`
  h1 {
    margin: 0;
  }

  .page_404{ padding:40px 0; background:#fff; font-family: 'Arvo', serif; }

  .page_404 img{ width:100%; }

  .four_zero_four_bg {
    background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
    width: 100%;
    max-width: 800px;
    height: 400px;
    max-height: 600px;
    background-position: center;
    background-size: cover;
  }
 
  .four_zero_four_bg h1{
    font-size:80px;
  }
 
  .four_zero_four_bg h3{
    font-size:80px;
  }
       
  .link_404 {      
    color: #fff!important;
    padding: 10px 20px;
    background: #39ac31;
    margin: 20px 0;
    display: inline-block;
  }
  .contant_box_404 { margin-top:-50px; }
`;