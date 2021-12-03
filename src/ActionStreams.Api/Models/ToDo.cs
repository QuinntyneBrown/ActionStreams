using ActionStreams.Api.Core;
using ActionStreams.Api.DomainEvents;
using System;

namespace ActionStreams.Api.Models
{
    public class ToDo: AggregateRoot
    {
        public Guid ToDoId { get; private set; }
        public string Description { get; private set; }
        public string Status { get; private set; }

        private ToDo()
        {

        }

        public ToDo(CreateToDo @event)
        {
            Apply(@event);
        }

        protected override void When(dynamic @event) => When(@event);

        protected override void EnsureValidState()
        {
            if(string.IsNullOrEmpty(Description) || string.IsNullOrEmpty(Status))
            {
                throw new Exception("Invaild ToDo");
            }
        }

        private void When(CreateToDo @event)
        {
            ToDoId = @event.ToDoId;
            Description = @event.Description;
            Status = @event.Status;
        }

        private void When(UpdateToDo @event)
        {
            Description = @event.Description;
            Status = @event.Status;
        }

        private void When(DeleteToDo @event)
        {

        }
    }
}
