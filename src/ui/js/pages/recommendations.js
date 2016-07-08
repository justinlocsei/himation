import IndexPage from 'himation/ui/js/containers/pages';
import RecommendationsPage from 'himation/ui/js/containers/pages/recommendations';
import { getPrerenderedState, renderPageComponent } from 'himation/ui/js/rendering';

const state = getPrerenderedState();
const showRecommendations = state.survey ? !state.survey.form.failedValidation : true;
const Page = showRecommendations ? RecommendationsPage : IndexPage;

renderPageComponent(Page);
