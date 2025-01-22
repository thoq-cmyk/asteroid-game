from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException, TimeoutException
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
import time
import re
import json

class EasyApplyLinkedin:

    def __init__(self, data):
        """Parameter initialization"""

        self.email = data['email']
        self.password = data['password']
        self.keywords = data['keywords']
        self.location = data['location']
        
        service = Service(data['driver-path'])
        self.driver = webdriver.Chrome(service=service, options=webdriver.ChromeOptions().add_argument("user-data-dir=/Users/tanzhoq/Library/Application Support/Google/Chrome"))

    def login_linkedin(self):
        """This function logs into your personal LinkedIn profile"""

        # go to the LinkedIn login url
        self.driver.get("https://www.linkedin.com/login")

        # introduce email and password and hit enter
        login_email = self.driver.find_element(By.NAME, 'session_key')
        login_email.clear()
        login_email.send_keys(self.email)
        login_pass = self.driver.find_element(By.NAME, 'session_password')
        login_pass.clear()
        login_pass.send_keys(self.password)
        login_pass.send_keys(Keys.RETURN)
    
    def job_search(self):
        """This function performs the job search"""
        # go to Jobs
        jobs_link = WebDriverWait(self.driver, 30).until(
            EC.visibility_of_element_located((By.XPATH, "//span[@title='Jobs']"))
        )
        jobs_link.click()

        # Show all button
        show_all_button = WebDriverWait(self.driver, 30).until(
            EC.visibility_of_element_located((By.XPATH, "//a[span[text()='Show all']]"))
        )
        show_all_button.click()

        # Click on the Easy Apply link after showing all jobs
        self.click_easy_apply()
        search_keywords = WebDriverWait(self.driver, 40).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, ".jobs-search-box__text-input[aria-label='Search jobs']"))
            )
        search_keywords.clear()
        search_keywords.send_keys(self.keywords)
        search_location = WebDriverWait(self.driver, 20).until(
                EC.visibility_of_element_located((By.CSS_SELECTOR, ".jobs-search-box__text-input[aria-label='Search location']"))
            )
        search_location.clear()
        search_location.send_keys(self.location)
        search_location.send_keys(Keys.RETURN)

    def click_easy_apply(self):
        """This function clicks on the Easy Apply link after showing all jobs"""
        try:
            print("Current URL:", self.driver.current_url)  # Debugging statement
            easy_apply_link = WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.XPATH, "//a[contains(@class, 'link-without-visited-state') and contains(., 'Easy Apply')]"))
            )
            print("Easy Apply link is visible.")
            easy_apply_link.click()
            print("Clicked on Easy Apply link.")
        except TimeoutException:
            print("Timeout: Easy Apply link not visible.")
        except NoSuchElementException:
            print("Easy Apply link not found.")
        except ElementClickInterceptedException:
            print("Could not click on Easy Apply link due to interception.")

    def click_second_easy_apply(self):
        """This function clicks on the second Easy Apply button after the first one is clicked"""
        try:
            second_easy_apply_button = WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.XPATH, "//span[contains(text(), 'Easy Apply')]"))
            )
            second_easy_apply_button.click()
            print("Clicked on the second Easy Apply button.")
        except NoSuchElementException:
            print("Second Easy Apply button not found.")
        except ElementClickInterceptedException:
            print("Could not click on the second Easy Apply button due to interception.")
    
    
    
    
    
    def click_third_easy_apply(self):
        """This function clicks on the third Easy Apply button after the second one is clicked"""
        try:
            third_easy_apply_button = WebDriverWait(self.driver, 30).until(
                EC.visibility_of_element_located((By.XPATH, "//span[@class='artdeco-button__text' and text()='Easy Apply']"))
            )
            third_easy_apply_button.click()
            print("Clicked on the third Easy Apply button.")
        except NoSuchElementException:
            print("Third Easy Apply button not found.")
        except ElementClickInterceptedException:
            print("Could not click on the third Easy Apply button due to interception.")

    def filter(self):
        """This function filters all the job results by 'Easy Apply'"""

        # select all filters, click on Easy Apply and apply the filter
        all_filters_button = self.driver.find_element(By.XPATH, "//button[@data-control-name='all_filters']")
        all_filters_button.click()
        time.sleep(1)
        easy_apply_button = self.driver.find_element(By.XPATH, "//label[@for='f_LF-f_AL']")
        easy_apply_button.click()
        time.sleep(1)
        apply_filter_button = self.driver.find_element(By.XPATH, "//button[@data-control-name='all_filters_apply']")
        apply_filter_button.click()

    def find_offers(self):
        """This function finds all the offers through all the pages result of the search and filter"""

        # find the total amount of results (if the results are above 24-more than one page-, we will scroll trhough all available pages)
        total_results = self.driver.find_element(By.CLASS_NAME, "display-flex.t-12.t-black--light.t-normal")
        total_results_int = int(total_results.text.split(' ',1)[0].replace(",",""))
        print(total_results_int)

        time.sleep(2)
        # get results for the first page
        current_page = self.driver.current_url
        results = self.driver.find_elements(By.CLASS_NAME, "occludable-update.artdeco-list__item--offset-4.artdeco-list__item.p0.ember-view")

        # for each job add, submits application if no questions asked
        for result in results:
            hover = ActionChains(self.driver).move_to_element(result)
            hover.perform()
            titles = result.find_elements(By.CLASS_NAME, 'job-card-search__title.artdeco-entity-lockup__title.ember-view')
            for title in titles:
                self.submit_apply(title)

        # if there is more than one page, find the pages and apply to the results of each page
        if total_results_int > 24:
            time.sleep(2)

            # find the last page and construct url of each page based on the total amount of pages
            find_pages = self.driver.find_elements(By.CLASS_NAME, "artdeco-pagination__indicator.artdeco-pagination__indicator--number")
            total_pages = find_pages[len(find_pages)-1].text
            total_pages_int = int(re.sub(r"[^\d.]", "", total_pages))
            get_last_page = self.driver.find_element(By.XPATH, "//button[@aria-label='Page "+str(total_pages_int)+"']")
            get_last_page.send_keys(Keys.RETURN)
            time.sleep(2)
            last_page = self.driver.current_url
            total_jobs = int(last_page.split('start=',1)[1])

            # go through all available pages and job offers and apply
            for page_number in range(25,total_jobs+25,25):
                self.driver.get(current_page+'&start='+str(page_number))
                time.sleep(2)
                results_ext = self.driver.find_elements(By.CLASS_NAME, "occludable-update.artdeco-list__item--offset-4.artdeco-list__item.p0.ember-view")
                for result_ext in results_ext:
                    hover_ext = ActionChains(self.driver).move_to_element(result_ext)
                    hover_ext.perform()
                    titles_ext = result_ext.find_elements(By.CLASS_NAME, 'job-card-search__title.artdeco-entity-lockup__title.ember-view')
                    for title_ext in titles_ext:
                        self.submit_apply(title_ext)
        else:
            self.close_session()

    def submit_apply(self, job_add):
        """This function submits the application for the job add found"""

        print('You are applying to the position of: ', job_add.text)
        job_add.click()
        time.sleep(2)

        # Check if the job has already been applied for
        try:
            footer = self.driver.find_element(By.CLASS_NAME, "job-card-list__footer-wrapper-v2")
            if "Viewed" in footer.text:
                print('You have already applied to this job, going to next...')
                return
        except NoSuchElementException:
            pass

        # click on the easy apply button, skip if already applied to the position
        try:
            in_apply = self.driver.find_element(By.XPATH, "//button[@data-control-name='jobdetails_topcard_inapply']")
            in_apply.click()
        except NoSuchElementException:
            print('You already applied to this job, go to next...')
            pass
        time.sleep(1)

        # try to submit if submit application is available...
        try:
            submit = self.driver.find_element(By.XPATH, "//button[@data-control-name='submit_unify']")
            submit.send_keys(Keys.RETURN)

        # ... if not available, discard application and go to next
        except NoSuchElementException:
            print('Not direct application, going to next...')
            try:
                discard = self.driver.find_element(By.XPATH, "//button[@data-test-modal-close-btn]")
                discard.send_keys(Keys.RETURN)
                time.sleep(1)
                discard_confirm = self.driver.find_element(By.XPATH, "//button[@data-test-dialog-primary-btn]")
                discard_confirm.send_keys(Keys.RETURN)
                time.sleep(1)
            except NoSuchElementException:
                pass

        time.sleep(1)

    def close_session(self):
        """This function closes the actual session"""
        
        print('End of the session, see you later!')
        self.driver.close()

    def apply(self):
        """Apply to job offers"""

        self.driver.maximize_window()
        self.login_linkedin()
        time.sleep(5)
        self.job_search()
        time.sleep(5)
        self.filter()
        time.sleep(2)
        self.find_offers()
        time.sleep(2)
        self.close_session()


if __name__ == '__main__':

    with open('config.json') as config_file:
        data = json.load(config_file)

    bot = EasyApplyLinkedin(data)
    bot.apply()
