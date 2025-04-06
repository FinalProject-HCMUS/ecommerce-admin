import axios from "axios";
import { Blog } from "../types";

const API_URL = './data.json';

export const getBlogs = async (): Promise<Blog[]> => {
    const response = await axios.get<{ blogs: Blog[] }>(API_URL);
    return response.data.blogs;
};

export const getBlogById = async (id: string): Promise<Blog | null> => {
    const blog: Blog = {
        id: '1',
        title: 'The Best Sportswear for Active Lifestyles',
        content: "<p><strong>🔥 TRANSFORM YOUR BODY JOIN [GYM NAME] TODAY! 🔥</strong></p><p>🏋️‍♂️ Get stronger, fitter, and healthier with our top-tier facilities and expert trainers!</p><p>✅ 24/7 Access</p><p> ✅ State-of-the-art Equipment</p><p> ✅ Personalized Training Programs</p><p> ✅ Group Fitness Classes (Yoga, HIIT, Zumba &amp; More!)</p><p> ✅ Affordable Membership Plans</p><p>💥 LIMITED-TIME OFFER: <strong>Get 50% OFF</strong> your first month when you sign up this week!</p><p>📍 Location: [Your Gym Address]</p><p> 📞 Call us at: [Your Contact Number]</p><p> 🌐 Visit us: [Your Website]</p><p>🚀 <strong>Your fitness journey starts NOW!</strong></p><p>#FitnessGoals #GymLife #TrainHard #GetFit</p>",
        image: "/images/blog4.png",
        created_At: new Date().toISOString(),
        updated_At: new Date().toISOString(),
    };
    return blog;
};