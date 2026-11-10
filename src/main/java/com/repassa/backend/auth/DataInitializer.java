package com.repassa.backend.auth;

import com.repassa.backend.category.Category;
import com.repassa.backend.category.CategoryRepository;
import com.repassa.backend.chat.ChatMessage;
import com.repassa.backend.chat.ChatMessageRepository;
import com.repassa.backend.chat.Conversation;
import com.repassa.backend.chat.ConversationRepository;
import com.repassa.backend.item.Item;
import com.repassa.backend.item.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final ItemRepository itemRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           CategoryRepository categoryRepository, ItemRepository itemRepository,
                           ConversationRepository conversationRepository,
                           ChatMessageRepository chatMessageRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedDemoData();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@repassa.com")) {
            User admin = new User();
            admin.setName("Admin RePassa");
            admin.setEmail("admin@repassa.com");
            admin.setPassword(passwordEncoder.encode("secret123"));
            admin.setPhone("(11) 99999-0000");
            admin.setCity("Sao Paulo");
            userRepository.save(admin);
        }
    }

    private void seedDemoData() {
        if (userRepository.existsByEmail("maria@repassa.com")) {
            return;
        }

        User maria = new User();
        maria.setName("Maria Souza");
        maria.setEmail("maria@repassa.com");
        maria.setPassword(passwordEncoder.encode("secret123"));
        maria.setPhone("(11) 98888-7777");
        maria.setCity("Sao Paulo");
        userRepository.save(maria);

        Category clothes = saveCategory("Clothes", "Clothing and shoes", "👕", maria);
        Category furniture = saveCategory("Furniture", "Home and office furniture", "🪑", maria);
        Category books = saveCategory("Books", "Books and study material", "📚", maria);

        Item jacket = saveItem(maria, clothes, "Winter Jacket",
                "Blue winter jacket, size M. Keeps you warm and is in great shape.",
                "Good", "Sao Paulo", "Pinheiros");
        saveItem(maria, furniture, "Study Desk",
                "Wooden study desk with two drawers.",
                "Fair", "Sao Paulo", "Vila Madalena");
        saveItem(maria, books, "Box of Books",
                "Box with 12 novels and study books.",
                "Good", "Sao Paulo", "Pinheiros");

        seedConversation(jacket, maria);
    }

    private Category saveCategory(String name, String description, String icon, User owner) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setIcon(icon);
        category.setUser(owner);
        return categoryRepository.save(category);
    }

    private Item saveItem(User owner, Category category, String title, String description,
                          String condition, String city, String neighborhood) {
        Item item = new Item();
        item.setTitle(title);
        item.setDescription(description);
        item.setCondition(condition);
        item.setCity(city);
        item.setNeighborhood(neighborhood);
        item.setAvailable(true);
        item.setCategory(category);
        item.setUser(owner);
        return itemRepository.save(item);
    }

    private void seedConversation(Item item, User announcer) {
        User admin = userRepository.findByEmail("admin@repassa.com").orElseThrow();

        Conversation conversation = new Conversation();
        conversation.setItem(item);
        conversation.setAnnouncer(announcer);
        conversation.setInterestedUser(admin);
        conversationRepository.save(conversation);

        saveMessage(conversation, admin, "Hi Maria! Is the jacket still available?", true);
        saveMessage(conversation, announcer, "Hi! Yes, it is. When would you like to pick it up?", true);
        saveMessage(conversation, admin, "I can pick it up this weekend. Does Saturday morning work?", false);
    }

    private void saveMessage(Conversation conversation, User sender, String content, boolean read) {
        ChatMessage message = new ChatMessage();
        message.setConversation(conversation);
        message.setSender(sender);
        message.setContent(content);
        message.setRead(read);
        chatMessageRepository.save(message);
    }
}
