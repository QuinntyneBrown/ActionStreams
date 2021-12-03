using ActionStreams.Api.Core;

namespace ActionStreams.Api.DomainEvents
{
    public class CreateToDo: BaseDomainEvent
    {
        public Guid ToDoId { get; private set; }
        public string Description { get; private set; }
        public string Status { get; private set; }

        public CreateToDo(string description)
        {
            ToDoId = Guid.NewGuid();
            Description = description;
            Status = "new";
        }
    }

    public class UpdateToDo : BaseDomainEvent
    {
        public string Description { get; private set; }
        public string Status { get; private set; }

        public UpdateToDo(string description, string status)
        {
            Description = description;
            Status = status;
        }
    }

    public class DeleteToDo : BaseDomainEvent
    {

    }
}
