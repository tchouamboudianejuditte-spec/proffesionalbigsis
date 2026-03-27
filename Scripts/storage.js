/**
 * ============================================
 * PROFESSIONAL BIG-SISTER SYSTEM
 * LOCALSTORAGE BACKEND GUIDE
 * ============================================
 * 
 * This is a simplified version to get you started
 * You can expand it based on your needs
 */

class PBSStorage {
  constructor() {
    this.prefix = 'pbs_';
  }

  // Basic storage methods
  set(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Retrieval error:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Removal error:', error);
      return false;
    }
  }

  // User Profile Management
  saveUserProfile(userData) {
    const currentProfile = this.get('user_profile', {});
    const updatedProfile = {
      ...currentProfile,
      ...userData,
      updated_at: new Date().toISOString()
    };
    this.set('user_profile', updatedProfile);
    return updatedProfile;
  }

  getUserProfile() {
    return this.get('user_profile', {
      name: '',
      email: '',
      is_logged_in: false,
      joined_date: new Date().toISOString()
    });
  }

  login(userData) {
    const profile = this.getUserProfile();
    const updatedProfile = {
      ...profile,
      ...userData,
      is_logged_in: true,
      last_login: new Date().toISOString()
    };
    return this.saveUserProfile(updatedProfile);
  }

  logout() {
    const profile = this.getUserProfile();
    const updatedProfile = {
      ...profile,
      is_logged_in: false,
      last_logout: new Date().toISOString()
    };
    return this.saveUserProfile(updatedProfile);
  }

  isLoggedIn() {
    const profile = this.getUserProfile();
    return profile.is_logged_in === true;
  }

  // Course Progress
  saveCourseProgress(courseId, progress) {
    const allProgress = this.get('course_progress', {});
    allProgress[courseId] = {
      ...progress,
      last_updated: new Date().toISOString()
    };
    this.set('course_progress', allProgress);
    return allProgress[courseId];
  }

  getCourseProgress(courseId) {
    const allProgress = this.get('course_progress', {});
    return courseId ? allProgress[courseId] : allProgress;
  }

  // Job Applications
  saveApplication(applicationData) {
    const applications = this.get('job_applications', []);
    const application = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...applicationData,
      created_at: new Date().toISOString(),
      status: 'submitted'
    };
    applications.push(application);
    this.set('job_applications', applications);
    return application;
  }

  getApplications() {
    return this.get('job_applications', []);
  }

  // Community Posts
  savePost(postData) {
    const posts = this.get('community_posts', []);
    const post = {
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...postData,
      created_at: new Date().toISOString(),
      likes: 0,
      comments: 0
    };
    posts.unshift(post); // Add to beginning
    this.set('community_posts', posts);
    return post;
  }

  getPosts() {
    return this.get('community_posts', []);
  }

  // Preferences
  savePreferences(prefs) {
    const current = this.get('preferences', {});
    const updated = {
      ...current,
      ...prefs,
      updated_at: new Date().toISOString()
    };
    this.set('preferences', updated);
    return updated;
  }

  getPreferences() {
    return this.get('preferences', {
      theme: 'light',
      notifications: true
    });
  }
}

// Create global instance
window.pbsStorage = new PBSStorage();

// Global helper functions for easy access
window.saveUserProfile = (data) => window.pbsStorage.saveUserProfile(data);
window.getUserProfile = () => window.pbsStorage.getUserProfile();
window.login = (data) => window.pbsStorage.login(data);
window.logout = () => window.pbsStorage.logout();
window.isLoggedIn = () => window.pbsStorage.isLoggedIn();

window.saveCourseProgress = (courseId, progress) => 
  window.pbsStorage.saveCourseProgress(courseId, progress);
window.getCourseProgress = (courseId) => 
  window.pbsStorage.getCourseProgress(courseId);

window.saveApplication = (data) => window.pbsStorage.saveApplication(data);
window.getApplications = () => window.pbsStorage.getApplications();

window.savePost = (data) => window.pbsStorage.savePost(data);
window.getPosts = () => window.pbsStorage.getPosts();

window.savePreferences = (data) => window.pbsStorage.savePreferences(data);
window.getPreferences = () => window.pbsStorage.getPreferences();

console.log('PBS Storage System Ready!');
