import React from 'react';
import StoryCard from './StoryCard'

  // Stories Section Component
  const StoriesSection = () => (
    <section className="section stories">
      <h2>Stories</h2>
      <div className="story-card-container">
        <StoryCard
          image={require("../images/img1.jpg")}
          title="The Dance of the Spirits"
          description="This story recounts the traditional belief that the aurora borealis is a dance performed by ancestral spirits, guiding and watching over the living."
        />
        <StoryCard
          image={require("../images/img2.png")}
          title="The Legend of the Northern Lights"
          description="An Indigenous elder shares a tale about how the northern lights were created by the spirits of the animals who passed on, bringing beauty to the night sky."
        />
        <StoryCard
          image={require("../images/img3.jpg")}
          title="The Sky's Color Palette"
          description="This story explores how different colors in the aurora represent various emotions and teachings, revealing the interconnectedness of nature and humanity."
        />
        <StoryCard
          image={require("../images/img4.png")}
          title="Whispers of the Wind"
          description="The wind carries whispers of ancient wisdom, guiding travelers through cold nights and reminding them of the stories told by their ancestors."
        />
      </div>
      <button className="button">Explore More Stories</button>
    </section>
  );

export default StoriesSection;
