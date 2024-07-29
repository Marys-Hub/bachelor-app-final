package ro.bachelor.backend.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import ro.bachelor.backend.task.TaskTag;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GenerativeAiService {

    private final ChatClient chatClient;

    public GenerativeAiService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generateMotivational() {
        var userPromptTemplate = """
                You are a supporting and helpful assistant for ADHD users.
                Write a supportive and motivational sentenced with maximum 100 words.
                Try not to repeat words and use smart words and sentences.
                """;

        return chatClient.prompt()
                .user(userSpec -> userSpec.text(userPromptTemplate))
                .call()
                .content();
    }

    public String generateShortMotivational() {
        var userPromptTemplate = """
                You are a supporting and helpful assistant for ADHD users.
                Write a supportive and motivational sentence with maximum 20 words.
                Try not to repeat words and use smart words and sentences.
                """;

        return chatClient.prompt()
                .user(userSpec -> userSpec.text(userPromptTemplate))
                .call()
                .content();
    }

    public String generateAbortUserMotivational() {
        var userPromptTemplate = """
                You are a supporting and helpful assistant for ADHD users.
                Write a supportive and motivational sentence with maximum 20 words for an user who cancelled or delete the task.
                """;

        return chatClient.prompt()
                .user(userSpec -> userSpec.text(userPromptTemplate))
                .call()
                .content();
    }

    public String generateSuccessUserMotivational() {
        var userPromptTemplate = """
                You are a supporting and helpful assistant for ADHD users.
                Write a supportive and motivational sentenced with maximum 20 words for an user who finish the task.
                Make him happy for this achievement.
                Try not to repeat words and use smart words and sentences.
                """;

        return chatClient.prompt()
                .user(userSpec -> userSpec.text(userPromptTemplate))
                .call()
                .content();
    }

    public String generateDoneAfterDeadlineUserMotivational() {
        var userPromptTemplate = """
                You are a supporting and helpful assistant for ADHD users.
                Write a supportive and motivational sentenced with maximum 20 words for an user who missed the deadline of the task.
                Try not to repeat words and use smart words and sentences.
                """;

        return chatClient.prompt()
                .user(userSpec -> userSpec.text(userPromptTemplate))
                .call()
                .content();
    }

    public String generateNotificationReminderUserMotivational(String username, String task, LocalDateTime deadline) {
        var systemPrompt = """
                You are a supporting and helpful assistant for ADHD users.
                Your primary function is to tell motivational and supportive messages.
                Try not to repeat words and use smart words and sentences and motivate him to finish his task on time.
                Your response should be only plaintext, do not expose that you are a chatbot or a system.
                """;

        var userPromptTemplate = """
                My email is {user} (please, do not change the email) and I work on a task called {task} with a deadline on {deadline}.
                """;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


        return chatClient.prompt()
                .system(systemSpec -> systemSpec.text(systemPrompt))
                .user(userSpec -> userSpec.text(userPromptTemplate)
                        .param("user", username)
                        .param("task", task)
                        .param("deadline", deadline.format(formatter)))
                .call()
                .content();
    }

    public String generateDescription(String title, List<TaskTag> tags) {
        var systemPrompt = """
                You are a supporting and helpful assistant for ADHD users.
                Your primary function is to help the user to complete a task description with more details.
                Response only with the description plaintext, no more additional text.
                """;

        return chatClient.prompt()
                .system(systemSpec -> systemSpec.text(systemPrompt))
                .user(userSpec -> {
                    if (tags == null) {
                        userSpec.text("""
                                        I want a description for my task with following title: {title}.
                                        """)
                                .param("title", title);
                    } else {
                        userSpec.text("""
                                        I want a description for my task with following title: {title} and the following tags: {tags}.
                                        """)
                                .param("title", title)
                                .param("tags", tags.stream().map(TaskTag::name).collect(Collectors.joining(", ")));
                    }
                })
                .call()
                .content();

    }
}
